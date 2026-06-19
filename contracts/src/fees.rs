/// Fee management and revenue distribution

use crate::storage;
use soroban_sdk::{Address, Env};

/// Calculate fee for a swap amount
pub fn calculate_fee(env: &Env, amount: i128) -> i128 {
    let fee_bp = storage::get_fee_bp(env);
    (amount * fee_bp as i128) / 10000
}

/// Collect fee from swap
pub fn collect_fee(env: &Env, token: &Address, fee_amount: i128) {
    let current = storage::get_fee_balance(env, token);
    storage::store_fee_balance(env, token, current + fee_amount);
}

/// Withdraw collected fees
pub fn withdraw_fees(env: &Env, token: &Address) -> i128 {
    let amount = storage::get_fee_balance(env, token);
    storage::store_fee_balance(env, token, 0);
    amount
}

/// Get collected fees for a token
pub fn get_fee_balance(env: &Env, token: &Address) -> i128 {
    storage::get_fee_balance(env, token)
}
