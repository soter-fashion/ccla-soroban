# CCLA Architecture Guide

## System Overview

The Cross-Chain Liquidity Aggregator is composed of interconnected modules working together to provide optimal routing and atomic swap execution.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│          Wallet Connect | Swap UI | Dashboard               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─→ Contract Client (TypeScript)
                 │
┌─────────────────────────────────────────────────────────────┐
│              Stellar Soroban Smart Contract                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Storage Layer                                       │  │
│  │  • Pool Registry (u64 → Pool mapping)               │  │
│  │  • Token Metadata (Address → Token info)            │  │
│  │  • Admin Config (Permissions, Fees)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Core Logic Layers                                   │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Pool Registry                                  │ │  │
│  │  │ • register_pool()  - Add new pool             │ │  │
│  │  │ • update_pool()    - Sync reserves            │ │  │
│  │  │ • get_all_pools()  - List pools               │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                         ↓                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Oracle & Quotes                                │ │  │
│  │  │ • get_price()      - Fetch prices             │ │  │
│  │  │ • cache_prices()   - Local caching            │ │  │
│  │  │ • get_quote()      - Calculate output         │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                         ↓                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Routing Engine                                 │ │  │
│  │  │ • find_best_route()    - BFS pathfinding      │ │  │
│  │  │ • calculate_output()   - Constant product    │ │  │
│  │  │ • optimize_path()      - Slippage minimization│ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                         ↓                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Executor                                       │ │  │
│  │  │ • validate_swap()      - Pre-flight checks    │ │  │
│  │  │ • execute_swap()       - Atomic execution     │ │  │
│  │  │ • collect_fees()       - Fee distribution     │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                         ↓                            │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ Advanced Features                              │ │  │
│  │  │ • flash_loans()        - Uncollateralized    │ │  │
│  │  │ • aggregation()        - Pool scoring         │ │  │
│  │  │ • access_control()     - Permission mgmt      │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                     ↓
    Stellar Swap         Phoenix DEX           Aqua
```

## Data Flow

### Swap Execution Flow

```
User initiates swap
         ↓
[1] Get Quote
    - Find best route through pools
    - Calculate expected output
    - Determine price impact
         ↓
[2] Validate
    - Check slippage protection
    - Verify pool liquidity
    - Check user balance
         ↓
[3] Execute
    - Transfer input tokens
    - Execute route atomically
    - Collect protocol fees
         ↓
[4] Settle
    - Transfer output tokens to user
    - Update pool reserves
    - Record transaction
         ↓
Transaction complete
```

### Pool Registry Update Flow

```
DEX Pool state changes
         ↓
Admin calls update_pool()
         ↓
Validate pool exists
         ↓
Update reserves
Update fee rate
Update timestamp
         ↓
Storage persisted
         ↓
Available for next routing
```

## Module Interactions

### Storage Layer

```rust
pub struct Pool {
    id: u64,                    // Unique ID
    address: Address,           // Pool contract
    token_a: Address,          // Token pair
    token_b: Address,
    reserve_a: i128,           // Liquidity
    reserve_b: i128,
    fee_rate: u32,             // Basis points
    dex: String,               // DEX name
    created_at: u32,           // Metadata
    updated_at: u32,
}
```

Storage operations use Soroban's persistent storage:
- Pool data: `env.storage().persistent()`
- Admin config: `env.storage().instance()`
- State versioning for upgrades

### Oracle Module

```rust
// Caching strategy
pub struct PriceCache {
    pool_id: u64,
    token_in: Address,
    token_out: Address,
    price: u128,
    timestamp: u32,             // TTL: 5 blocks
}
```

- Reduces oracle calls
- Prevents stale prices
- Automatic invalidation

### Routing Algorithm

Uses BFS (breadth-first search) with constant product formula:

```
For each pool connected to token_in:
    - Calculate output via x*y=k
    - Track path to token_out
    - Recursively explore secondary pools
    
Return path with maximum output
```

**Complexity**: O(P²) where P = number of pools

**Optimization**: 
- Cache recent routes
- Limit search depth to 3 hops
- Early termination on high output

### Executor Module

Atomic execution guarantees:

```
1. Pre-flight validation
   ├─ Pool exists and has liquidity
   ├─ User has sufficient balance
   └─ Slippage within tolerance

2. Execute transfers
   ├─ Debit input tokens from user
   ├─ Credit output tokens to user
   └─ Reentrancy guard active

3. Update state
   ├─ Record swap count
   ├─ Update trading volume
   ├─ Add fee earnings
   └─ Release reentrancy guard
```

## Security Architecture

### Access Control Layers

```
public        → Any user
                 - get_quote()
                 - swap()
                 - get_pools()

admin_only    → Contract admin
                 - register_pool()
                 - pause/unpause()
                 - withdraw_fees()
                 - update_pool()
```

### Vulnerability Prevention

| Threat | Mitigation |
|--------|-----------|
| Reentrancy | Guard flag + single-entry point |
| MEV/Slippage | User-controlled min_amount_out |
| Price Manipulation | Authenticated oracle + caching |
| DoS | Rate limiting + gas optimization |
| Overflow | Safe arithmetic via Rust |

### State Versioning

```rust
// Version 1
pub struct StateV1 {
    pools: Map<u64, Pool>,
    admin: Address,
}

// Version 2 (future)
pub struct StateV2 {
    pools: Map<u64, Pool>,
    admin: Address,
    governance_token: Address,  // New field
}

// Migration function
fn migrate_v1_to_v2() { /* ... */ }
```

## Performance Optimization

### Gas Optimization

1. **Minimal Storage**: Only essential state persisted
2. **Caching**: Price data kept in memory for 5 blocks
3. **Vector Ops**: Batch operations where possible
4. **Early Exit**: Return early if conditions met

### Throughput

- Single-pool swap: ~150K gas
- Dual-pool swap: ~250K gas
- Quote calculation: ~50K gas

### Scalability

Current limits (tunable):
- Max pools: 1,000,000
- Max route hops: 3
- Max concurrent swaps: Unlimited (atomic)

## Frontend Architecture

### State Management

```
useWallet() 
  ├─ account state
  ├─ connect/disconnect
  └─ transaction signing

useQuotes()
  ├─ fetch price data
  ├─ cache results
  └─ refresh every 10s

useSwap()
  ├─ execute transaction
  ├─ error handling
  └─ confirmation polling
```

### Component Hierarchy

```
App (Layout)
├─ Navigation
│  ├─ Links
│  └─ WalletConnect
├─ Page Router
│  ├─ /swap → SwapForm
│  ├─ /pools → PoolExplorer
│  └─ /dashboard → Dashboard
└─ Global Styles (Tailwind)
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Stellar Testnet                         │
│  ├─ CCLA Contract (deployed)            │
│  ├─ Pool Contracts (referenced)         │
│  └─ Token Contracts (USDC, XLM, etc)   │
└─────────────────────────────────────────┘
           ↑
           │
┌──────────────────────────────────────────┐
│  Frontend (Vercel/AWS)                   │
│  ├─ Next.js build (optimized)           │
│  ├─ Contract ABI + addresses            │
│  └─ Environment config                  │
└──────────────────────────────────────────┘
```

## Future Enhancements

### Phase 2
- Multi-DEX price aggregation
- Dynamic fee tier selection
- Batch swap operations

### Phase 3
- Governance token (CCLA)
- DAO treasury management
- Liquidity mining programs
- Cross-chain bridges (Soroban↔Ethereum)

---

**This architecture ensures production-grade reliability, security, and performance for DEX aggregation on Stellar Soroban.**
