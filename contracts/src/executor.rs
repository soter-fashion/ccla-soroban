/// Swap execution engine

use crate::types::{Route, SwapExecution};
use crate::storage;
use crate::fees;
use soroban_sdk::{Address, Env};

/// Execute a swap along a route
pub fn execute_swap(
    env: &Env,
    route: &Route,
    amount_in: i128,
    min_amount_out: i128,
    user: &Address,
) -> i128 {
    // Validate route
    if route.pool_ids.is_empty() {
        panic!("Invalid route: no pools");
    }

    // Check slippage protection
    if route.amount_out < min_amount_out {
        panic!("Slippage exceeded");
    }

    // Calculate fees
    let fee_amount = fees::calculate_fee(env, amount_in);

    // Record swap statistics
    storage::increment_swap_count(env);
    storage::add_volume(env, amount_in);
    storage::add_fees(env, fee_amount);

    // Return output amount
    route.amount_out - fee_amount
}

/// Validate swap parameters
pub fn validate_swap(amount_in: i128, min_amount_out: i128) -> bool {
    amount_in > 0 && min_amount_out > 0 && min_amount_out <= amount_in
}
