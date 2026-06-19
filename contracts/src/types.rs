/// Core data types for the Cross-Chain Liquidity Aggregator

use soroban_sdk::{Address, Env, String, Vec};

/// Represents a liquidity pool
#[derive(Clone, Debug, PartialEq)]
pub struct Pool {
    /// Unique identifier
    pub id: u64,
    /// Pool contract address
    pub address: Address,
    /// First token in pair
    pub token_a: Address,
    /// Second token in pair
    pub token_b: Address,
    /// Reserve of token A
    pub reserve_a: i128,
    /// Reserve of token B
    pub reserve_b: i128,
    /// Fee rate in basis points
    pub fee_rate: u32,
    /// DEX name (e.g., "stellar-swap")
    pub dex: String,
    /// When pool was registered (ledger number)
    pub created_at: u32,
    /// Last update ledger number
    pub updated_at: u32,
}

/// Token information
#[derive(Clone, Debug)]
pub struct Token {
    pub address: Address,
    pub decimals: u32,
    pub symbol: String,
}

/// Price information for a token pair
#[derive(Clone, Debug)]
pub struct Price {
    /// Source pool ID
    pub pool_id: u64,
    /// Input token
    pub token_in: Address,
    /// Output token
    pub token_out: Address,
    /// Amount in
    pub amount_in: i128,
    /// Amount out (expected)
    pub amount_out: i128,
    /// Execution price
    pub execution_price: u128,
    /// Price impact percentage (0-10000 = 0-100%)
    pub price_impact: u32,
    /// When this price was cached (ledger number)
    pub timestamp: u32,
}

/// A swap route through one or more pools
#[derive(Clone, Debug)]
pub struct Route {
    /// Input token
    pub token_in: Address,
    /// Output token
    pub token_out: Address,
    /// Sequence of pool IDs
    pub pool_ids: Vec<u64>,
    /// Expected output amount
    pub amount_out: i128,
    /// Total slippage percentage
    pub slippage_percent: u32,
    /// Fee estimate
    pub fee_amount: i128,
}

/// Quote for a potential swap
#[derive(Clone, Debug)]
pub struct Quote {
    /// Input token
    pub token_in: Address,
    /// Output token
    pub token_out: Address,
    /// Input amount
    pub amount_in: i128,
    /// Expected output
    pub amount_out: i128,
    /// Minimum output with slippage
    pub min_amount_out: i128,
    /// Price impact
    pub price_impact: u32,
    /// Recommended route
    pub route: Route,
}

/// Execution route for a swap
#[derive(Clone, Debug)]
pub struct SwapExecution {
    pub route: Route,
    pub amount_in: i128,
    pub amount_out: i128,
    pub fees_paid: i128,
}

/// Pool information for display
#[derive(Clone, Debug)]
pub struct PoolInfo {
    pub id: u64,
    pub dex: String,
    pub token_a_symbol: String,
    pub token_b_symbol: String,
    pub tvl_usd: u128,
    pub apr: u32,
    pub last_updated: u32,
}

/// Contract statistics
#[derive(Clone, Debug)]
pub struct ContractStats {
    pub total_pools: u64,
    pub total_swaps: u64,
    pub total_volume: i128,
    pub total_fees: i128,
    pub is_paused: bool,
}

/// Access control error types
#[derive(Clone, Debug, PartialEq)]
pub enum AccessError {
    Unauthorized,
    AdminOnly,
    ContractPaused,
    AlreadyInitialized,
}

/// Pool registry error types
#[derive(Clone, Debug, PartialEq)]
pub enum PoolError {
    PoolNotFound,
    InvalidPool,
    DuplicatePool,
    InsufficientLiquidity,
    InvalidReserves,
}

/// Routing error types
#[derive(Clone, Debug, PartialEq)]
pub enum RoutingError {
    NoRoutePath,
    InvalidRoute,
    ExcessiveSlippage,
    InsufficientLiquidity,
}

/// Execution error types
#[derive(Clone, Debug, PartialEq)]
pub enum ExecutionError {
    SwapFailed,
    SlippageExceeded,
    InsufficientOutput,
    TransferFailed,
    InsufficientBalance,
}

/// Flash loan error types
#[derive(Clone, Debug, PartialEq)]
pub enum FlashLoanError {
    CallbackFailed,
    InsufficientRepayment,
    InvalidAmount,
    ReentrancyDetected,
}
