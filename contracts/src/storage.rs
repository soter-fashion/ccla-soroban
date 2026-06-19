/// Storage layer for persistent state management

use crate::types::{Pool, PoolInfo, ContractStats};
use soroban_sdk::{Address, Env, Map, Symbol, String, Vec, symbol_short};

// Storage keys
const ADMIN: &str = "admin";
const INITIALIZED: &str = "init";
const PAUSED: &str = "paused";
const FEE_BP: &str = "fee_bp";
const FEE_RECIPIENT: &str = "fee_rcpt";
const POOLS: &str = "pools";
const POOL_COUNT: &str = "pool_cnt";
const POOL_INDEX: &str = "pool_idx";
const TOTAL_SWAPS: &str = "total_swaps";
const TOTAL_VOLUME: &str = "total_vol";
const TOTAL_FEES: &str = "total_fees";
const FLASH_LOAN_REENTRANCY_GUARD: &str = "fl_guard";

/// Set admin address
pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&symbol_short!("admin"), admin);
}

/// Get admin address
pub fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get::<_, Address>(&symbol_short!("admin"))
        .unwrap_or_else(|| panic!("Admin not set"))
}

/// Set initialized flag
pub fn set_initialized(env: &Env) {
    env.storage().instance().set(&symbol_short!("init"), &true);
}

/// Check if contract is initialized
pub fn is_initialized(env: &Env) -> bool {
    env.storage()
        .instance()
        .get::<_, bool>(&symbol_short!("init"))
        .unwrap_or(false)
}

/// Set paused state
pub fn set_paused(env: &Env, paused: bool) {
    env.storage().instance().set(&symbol_short!("paused"), &paused);
}

/// Get paused state
pub fn is_paused(env: &Env) -> bool {
    env.storage()
        .instance()
        .get::<_, bool>(&symbol_short!("paused"))
        .unwrap_or(false)
}

/// Set fee basis points
pub fn set_fee_bp(env: &Env, fee_bp: u32) {
    env.storage().instance().set(&symbol_short!("fee_bp"), &fee_bp);
}

/// Get fee basis points
pub fn get_fee_bp(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get::<_, u32>(&symbol_short!("fee_bp"))
        .unwrap_or(0)
}

/// Set fee recipient address
pub fn set_fee_recipient(env: &Env, recipient: &Address) {
    env.storage().instance().set(&symbol_short!("fee_rcpt"), recipient);
}

/// Get fee recipient address
pub fn get_fee_recipient(env: &Env) -> Address {
    env.storage()
        .instance()
        .get::<_, Address>(&symbol_short!("fee_rcpt"))
        .unwrap_or_else(|| panic!("Fee recipient not set"))
}

/// Store a pool
pub fn store_pool(env: &Env, pool: &Pool) {
    let key = pool_key(&pool.id);
    env.storage().persistent().set(&key, pool);
}

/// Retrieve a pool by ID
pub fn get_pool(env: &Env, pool_id: u64) -> Option<Pool> {
    let key = pool_key(&pool_id);
    env.storage().persistent().get::<_, Pool>(&key)
}

/// Get all pools
pub fn get_all_pools(env: &Env) -> Vec<Pool> {
    let mut pools = Vec::new();
    let count = get_pool_count(env);

    for i in 0..count {
        if let Some(pool) = get_pool(env, i) {
            pools.push_back(pool);
        }
    }

    pools
}

/// Increment and return next pool ID
pub fn next_pool_id(env: &Env) -> u64 {
    let count = get_pool_count(env);
    set_pool_count(env, count + 1);
    count
}

/// Get total pool count
pub fn get_pool_count(env: &Env) -> u64 {
    env.storage()
        .instance()
        .get::<_, u64>(&symbol_short!("pool_cnt"))
        .unwrap_or(0)
}

/// Set total pool count
pub fn set_pool_count(env: &Env, count: u64) {
    env.storage().instance().set(&symbol_short!("pool_cnt"), &count);
}

/// Increment swap counter
pub fn increment_swap_count(env: &Env) {
    let count = env.storage()
        .instance()
        .get::<_, u64>(&symbol_short!("total_swaps"))
        .unwrap_or(0);
    env.storage().instance().set(&symbol_short!("total_swaps"), &(count + 1));
}

/// Get total swaps
pub fn get_total_swaps(env: &Env) -> u64 {
    env.storage()
        .instance()
        .get::<_, u64>(&symbol_short!("total_swaps"))
        .unwrap_or(0)
}

/// Add to total volume
pub fn add_volume(env: &Env, amount: i128) {
    let volume = env.storage()
        .instance()
        .get::<_, i128>(&symbol_short!("total_vol"))
        .unwrap_or(0);
    env.storage().instance().set(&symbol_short!("total_vol"), &(volume + amount));
}

/// Get total volume
pub fn get_total_volume(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get::<_, i128>(&symbol_short!("total_vol"))
        .unwrap_or(0)
}

/// Add to collected fees
pub fn add_fees(env: &Env, amount: i128) {
    let fees = env.storage()
        .instance()
        .get::<_, i128>(&symbol_short!("total_fees"))
        .unwrap_or(0);
    env.storage().instance().set(&symbol_short!("total_fees"), &(fees + amount));
}

/// Get total collected fees
pub fn get_total_fees(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get::<_, i128>(&symbol_short!("total_fees"))
        .unwrap_or(0)
}

/// Get contract statistics
pub fn get_stats(env: &Env) -> ContractStats {
    ContractStats {
        total_pools: get_pool_count(env),
        total_swaps: get_total_swaps(env),
        total_volume: get_total_volume(env),
        total_fees: get_total_fees(env),
        is_paused: is_paused(env),
    }
}

/// Set reentrancy guard for flash loans
pub fn set_flash_loan_guard(env: &Env, active: bool) {
    env.storage().instance().set(&symbol_short!("fl_guard"), &active);
}

/// Get reentrancy guard status
pub fn get_flash_loan_guard(env: &Env) -> bool {
    env.storage()
        .instance()
        .get::<_, bool>(&symbol_short!("fl_guard"))
        .unwrap_or(false)
}

/// Store fee balance for a token
pub fn store_fee_balance(env: &Env, token: &Address, balance: i128) {
    let key = fee_balance_key(token);
    env.storage().persistent().set(&key, &balance);
}

/// Get fee balance for a token
pub fn get_fee_balance(env: &Env, token: &Address) -> i128 {
    let key = fee_balance_key(token);
    env.storage()
        .persistent()
        .get::<_, i128>(&key)
        .unwrap_or(0)
}

// Helper function to generate pool storage key
fn pool_key(id: &u64) -> Symbol {
    // In production, use proper key generation
    symbol_short!("pool")
}

// Helper function to generate fee balance key
fn fee_balance_key(token: &Address) -> Symbol {
    // In production, use proper key generation
    symbol_short!("fee")
}
