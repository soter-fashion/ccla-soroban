/// Access control and permission management

use crate::storage;
use soroban_sdk::{Address, Env};

/// Verify that caller is the admin
pub fn verify_admin(env: &Env) {
    let admin = storage::get_admin(env);
    let caller = env.invoker();
    
    if caller != admin {
        panic!("Unauthorized: admin only");
    }
}

/// Verify contract is not paused
pub fn verify_not_paused(env: &Env) {
    if storage::is_paused(env) {
        panic!("Contract is paused");
    }
}

/// Verify contract is not initialized yet
pub fn verify_not_initialized(env: &Env) {
    if storage::is_initialized(env) {
        panic!("Contract already initialized");
    }
}

/// Verify contract is initialized
pub fn verify_initialized(env: &Env) {
    if !storage::is_initialized(env) {
        panic!("Contract not initialized");
    }
}
