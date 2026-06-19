/// Liquidity aggregation and pool scoring

use crate::types::Pool;
use soroban_sdk::{Env, Vec};

/// Score a pool based on liquidity depth and performance
pub fn score_pool(pool: &Pool) -> u32 {
    let tvl = (pool.reserve_a.abs() as u128) + (pool.reserve_b.abs() as u128);
    
    // Higher TVL = higher score
    let tvl_score = if tvl > 1_000_000_000_000_000 {
        10000
    } else if tvl > 100_000_000_000_000 {
        8000
    } else if tvl > 10_000_000_000_000 {
        6000
    } else {
        2000
    };

    // Lower fees = higher score
    let fee_score = if pool.fee_rate < 50 {
        10000
    } else if pool.fee_rate < 100 {
        8000
    } else {
        6000
    };

    // Average the scores
    (tvl_score + fee_score) / 2
}

/// Get top pools by liquidity
pub fn get_top_pools(pools: &Vec<Pool>, limit: u32) -> Vec<Pool> {
    let mut scored_pools: Vec<(Pool, u32)> = Vec::new();
    
    for pool in pools.iter() {
        let score = score_pool(&pool);
        scored_pools.push_back((pool.clone(), score));
    }

    // Sort by score (highest first)
    // Note: In production, use proper sorting
    
    let mut top_pools = Vec::new();
    let mut count = 0;
    
    for (pool, _score) in scored_pools.iter() {
        if count < limit as usize {
            top_pools.push_back(pool.clone());
            count += 1;
        }
    }
    
    top_pools
}
