#!/bin/bash

# CCLA Smart Contract Deployment Script for Stellar Testnet

set -e

NETWORK="testnet"
SOROBAN_RPC_URL="https://soroban-testnet.stellar.org"

echo "=========================================="
echo "CCLA Smart Contract Deployment"
echo "Network: $NETWORK"
echo "RPC: $SOROBAN_RPC_URL"
echo "=========================================="

# Function to check if soroban CLI is installed
check_soroban_cli() {
  if ! command -v soroban &> /dev/null; then
    echo "ERROR: soroban CLI not found. Please install it:"
    echo "  https://developers.stellar.org/docs/smart-contracts/guides/deployment"
    exit 1
  fi
  echo "✓ soroban CLI found"
}

# Function to build contracts
build_contracts() {
  echo ""
  echo "Building smart contracts..."
  cd contracts
  cargo build --release --target wasm32-unknown-unknown
  cd ..
  echo "✓ Contracts built successfully"
}

# Function to deploy contract
deploy_contract() {
  echo ""
  echo "Deploying CCLA contract..."
  
  WASM_PATH="./contracts/target/wasm32-unknown-unknown/release/ccla_soroban.wasm"
  
  if [ ! -f "$WASM_PATH" ]; then
    echo "ERROR: WASM file not found at $WASM_PATH"
    exit 1
  fi
  
  CONTRACT_ID=$(soroban contract deploy \
    --network "$NETWORK" \
    --rpc-url "$SOROBAN_RPC_URL" \
    --wasm "$WASM_PATH")
  
  echo "✓ Contract deployed: $CONTRACT_ID"
  echo "CONTRACT_ID=$CONTRACT_ID" > .env.local
}

# Function to initialize contract
initialize_contract() {
  echo ""
  echo "Initializing contract..."
  
  # Read contract ID from env
  source .env.local
  
  # Admin address (set to deployer address in production)
  ADMIN_ADDRESS="GBRPYHIL2CI3WHZDTOOQFC6EB4NCSK5EXTZLQ2IJLGYBY7HQWBMBTMY"
  
  # Fee in basis points (30 = 0.3%)
  FEE_BP="30"
  
  # Fee recipient address
  FEE_RECIPIENT="GBRPYHIL2CI3WHZDTOOQFC6EB4NCSK5EXTZLQ2IJLGYBY7HQWBMBTMY"
  
  soroban contract invoke \
    --network "$NETWORK" \
    --rpc-url "$SOROBAN_RPC_URL" \
    --id "$CONTRACT_ID" \
    -- init \
    --admin "$ADMIN_ADDRESS" \
    --fee_bp "$FEE_BP" \
    --fee_recipient "$FEE_RECIPIENT"
  
  echo "✓ Contract initialized successfully"
}

# Function to verify deployment
verify_deployment() {
  echo ""
  echo "Verifying deployment..."
  
  source .env.local
  
  # Check contract exists
  CONTRACT_INFO=$(soroban contract info \
    --network "$NETWORK" \
    --rpc-url "$SOROBAN_RPC_URL" \
    --id "$CONTRACT_ID" 2>/dev/null || echo "")
  
  if [ -z "$CONTRACT_INFO" ]; then
    echo "⚠ Contract verification pending (may take a few moments)"
  else
    echo "✓ Contract verified on network"
  fi
}

# Main deployment flow
main() {
  check_soroban_cli
  build_contracts
  deploy_contract
  initialize_contract
  verify_deployment
  
  echo ""
  echo "=========================================="
  echo "Deployment Complete!"
  echo "Contract ID: $(cat .env.local | grep CONTRACT_ID)"
  echo "=========================================="
  echo ""
  echo "Next steps:"
  echo "1. Add contract address to frontend .env"
  echo "2. Test with: npm run test:integration"
  echo "3. Deploy frontend: npm run build && npm start"
}

main "$@"
