/// Quote engine for swap previews

use crate::types::{Quote, Route};
use crate::routing;
use soroban_sdk::{Address, Env};

/// Get a detailed quote for a swap without executing
pub fn get_quote(
    env: &Env,
    token_in: &Address,
    token_out: &Address,
    amount_in: i128,
) -> Quote {
    let route = routing::find_best_route(env, token_in, token_out, amount_in);
    
    Quote {
        token_in: token_in.clone(),
        token_out: token_out.clone(),
        amount_in,
        amount_out: route.amount_out,
        min_amount_out: (route.amount_out * 99) / 100, // 1% slippage default
        price_impact: route.slippage_percent,
        route,
    }
}
