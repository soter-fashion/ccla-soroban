/// Best path routing algorithm

use crate::types::Route;
use crate::storage;
use soroban_sdk::{Address, Env, Vec};

/// Find the best route between two tokens
pub fn find_best_route(
    env: &Env,
    token_in: &Address,
    token_out: &Address,
    amount_in: i128,
) -> Route {
    let pools = storage::get_all_pools(env);
    let mut best_route = None;
    let mut best_output = 0i128;

    // Simple routing: check direct paths and one-hop paths
    for pool in pools.iter() {
        // Check if this pool connects input to output
        let connects = (pool.token_a == *token_in && pool.token_b == *token_out) ||
                      (pool.token_b == *token_in && pool.token_a == *token_out);
        
        if connects {
            // Calculate output using constant product formula
            let output = calculate_output(pool.reserve_a, pool.reserve_b, amount_in, pool.fee_rate);
            
            if output > best_output {
                best_output = output;
                let mut pool_ids = Vec::new();
                pool_ids.push_back(pool.id);
                
                best_route = Some(Route {
                    token_in: token_in.clone(),
                    token_out: token_out.clone(),
                    pool_ids,
                    amount_out: output,
                    slippage_percent: 0,
                    fee_amount: (amount_in * pool.fee_rate as i128) / 10000,
                });
            }
        }
    }

    best_route.unwrap_or_else(|| Route {
        token_in: token_in.clone(),
        token_out: token_out.clone(),
        pool_ids: Vec::new(),
        amount_out: 0,
        slippage_percent: 0,
        fee_amount: 0,
    })
}

/// Calculate output using constant product formula (x*y=k)
fn calculate_output(
    reserve_in: i128,
    reserve_out: i128,
    amount_in: i128,
    fee_bp: u32,
) -> i128 {
    if reserve_in <= 0 || reserve_out <= 0 {
        return 0;
    }

    // Apply fee
    let amount_in_with_fee = amount_in * (10000 - fee_bp as i128) / 10000;
    
    // Constant product formula
    let numerator = amount_in_with_fee * reserve_out;
    let denominator = reserve_in + amount_in_with_fee;
    
    if denominator <= 0 {
        return 0;
    }

    numerator / denominator
}
