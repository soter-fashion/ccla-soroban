# CCLA Deployment Guide

## Prerequisites

### System Requirements

- **OS**: Linux, macOS, or Windows with WSL2
- **RAM**: 4GB minimum
- **Disk**: 5GB free space
- **Internet**: Stable connection to Stellar Testnet

### Required Software

```bash
# 1. Rust (for smart contract compilation)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup target add wasm32-unknown-unknown

# 2. Soroban CLI
cargo install soroban-cli

# 3. Node.js (for frontend)
# Download from https://nodejs.org (v18+)
node --version  # Verify: v18.x.x or higher

# 4. Git
git --version  # Should be installed
```

### Stellar Test Account

1. Visit [Stellar Lab](https://lab.stellar.org/)
2. Create a test keypair
3. Fund with testnet XLM via [Friendbot](https://friendbot.stellar.org/)

```bash
# Example
ACCOUNT_ID="GBRPYHIL2CI3WHZDTOOQFC6EB4NCSK5EXTZLQ2IJLGYBY7HQWBMBTMY"
curl https://friendbot.stellar.org?addr=$ACCOUNT_ID
```

---

## Step 1: Clone Repository

```bash
git clone https://github.com/stellar/ccla-soroban.git
cd ccla-soroban
```

---

## Step 2: Build Smart Contract

### Compile to WASM

```bash
cd contracts

# Build in release mode
cargo build --release --target wasm32-unknown-unknown

# Verify build
ls -lh target/wasm32-unknown-unknown/release/ccla_soroban.wasm
```

Expected output: ~100-150KB WASM file

### Run Tests

```bash
# Unit tests
cargo test --all

# Integration tests
cargo test --all -- --test-threads=1

# Property-based tests
cargo test --all proptest
```

All tests should pass before deployment.

---

## Step 3: Deploy to Testnet

### Using Deployment Script

```bash
cd ../deploy

# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Script will:
1. ✅ Check Soroban CLI installation
2. ✅ Build WASM contract
3. ✅ Deploy to Soroban Testnet
4. ✅ Initialize contract
5. ✅ Verify deployment
6. ✅ Save contract ID to `.env.local`

### Manual Deployment (Alternative)

```bash
# Build
cargo build --release --target wasm32-unknown-unknown

# Deploy
soroban contract deploy \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --wasm ./target/wasm32-unknown-unknown/release/ccla_soroban.wasm \
  --source-account $YOUR_PUBLIC_KEY

# Save the returned contract ID
export CONTRACT_ID="CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4"
```

### Initialize Contract

```bash
# Set environment variables
export ADMIN_ADDRESS=$YOUR_PUBLIC_KEY
export FEE_BP=30  # 0.3%
export FEE_RECIPIENT=$YOUR_PUBLIC_KEY

# Initialize
soroban contract invoke \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --id $CONTRACT_ID \
  -- init \
  --admin $ADMIN_ADDRESS \
  --fee_bp $FEE_BP \
  --fee_recipient $FEE_RECIPIENT
```

---

## Step 4: Verify Deployment

### Check Contract Status

```bash
soroban contract info \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --id $CONTRACT_ID
```

### Test Basic Functions

```bash
# Get stats
soroban contract invoke \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --id $CONTRACT_ID \
  -- get_stats

# Should return something like:
# {
#   "total_pools": 0,
#   "total_swaps": 0,
#   "total_volume": 0,
#   "total_fees": 0,
#   "is_paused": false
# }
```

---

## Step 5: Deploy Frontend

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Configure Environment

Create `.env.local`:

```bash
# Contract
NEXT_PUBLIC_CONTRACT_ID=$CONTRACT_ID
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Network
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Optional: Analytics, logging, etc.
NEXT_PUBLIC_ENVIRONMENT=testnet
```

### Build

```bash
npm run build

# Check for errors
npm run type-check
```

### Test Locally

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Test wallet connection and basic swap flow
```

### Deploy to Production

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link repo and configure
```

#### Option B: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync .next s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### Option C: Docker + Custom Server

```bash
# Create Dockerfile (included in repo)
docker build -t ccla-frontend .

# Run container
docker run -p 3000:3000 ccla-frontend

# Push to registry
docker push your-registry/ccla-frontend:latest
```

---

## Step 6: Register Pools

```bash
# Get list of existing pools from DEXes
# Register each pool with CCLA

soroban contract invoke \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --id $CONTRACT_ID \
  -- register_pool \
  --pool_address CAAAA... \
  --token_a GBBD... \
  --token_b GBBC... \
  --dex_name "Stellar Swap"
```

Repeat for each pool from:
- Stellar Swap
- Phoenix DEX
- Aqua Protocol
- Other DEXes

---

## Step 7: Monitor & Maintain

### Logs

```bash
# Contract interaction logs
soroban contract logs \
  --network testnet \
  --id $CONTRACT_ID

# Frontend logs (Vercel)
vercel logs
```

### Pool Updates

Update pool reserves periodically:

```bash
# Create cron job to update every hour
0 * * * * /path/to/update_pools.sh
```

### Pause If Issues

```bash
soroban contract invoke \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --id $CONTRACT_ID \
  -- pause
```

### Collect Fees

```bash
soroban contract invoke \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --id $CONTRACT_ID \
  -- withdraw_fees \
  --token GBBD...
```

---

## Troubleshooting

### "soroban: command not found"

```bash
# Ensure soroban-cli is installed
cargo install soroban-cli --locked

# Add to PATH if needed
export PATH="~/.cargo/bin:$PATH"
```

### "WASM file not found"

```bash
# Rebuild contract
cd contracts
cargo build --release --target wasm32-unknown-unknown

# Verify file exists
ls target/wasm32-unknown-unknown/release/ccla_soroban.wasm
```

### Contract Deploy Timeout

```bash
# Increase timeout and retry
soroban contract deploy \
  --network testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --wasm ./target/wasm32-unknown-unknown/release/ccla_soroban.wasm \
  --source-account $YOUR_PUBLIC_KEY \
  --timeout 60  # seconds
```

### Insufficient Balance

```bash
# Fund account with Friendbot
curl https://friendbot.stellar.org?addr=$YOUR_PUBLIC_KEY

# Check balance
soroban config identity show
```

### Frontend Not Loading Contract

1. Verify `.env.local` has correct `CONTRACT_ID`
2. Test with: `curl $NEXT_PUBLIC_SOROBAN_RPC_URL`
3. Check browser console for errors
4. Verify wallet connection

---

## Mainnet Deployment

When ready for mainnet:

### Requirements

1. **Audit**: Security audit completed and passed
2. **Testing**: Full testnet testing completed
3. **Legal**: Terms of service and disclaimers in place
4. **Community**: Support channels established

### Process

```bash
# 1. Change network to mainnet
./deploy.sh --network mainnet

# 2. Use mainnet URLs
SOROBAN_RPC_URL="https://soroban-mainnet.stellar.org"

# 3. Update frontend config
NEXT_PUBLIC_NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"

# 4. Deploy frontend to mainnet CDN
vercel --prod
```

---

## Rollback Procedures

If critical issues arise:

```bash
# 1. Pause contract
soroban contract invoke \
  --network testnet \
  --id $CONTRACT_ID \
  -- pause

# 2. Deploy previous frontend version
vercel rollback

# 3. Investigate issues
# 4. Deploy fix
# 5. Unpause
soroban contract invoke \
  --network testnet \
  --id $CONTRACT_ID \
  -- unpause
```

---

## Support

- 📖 [Stellar Docs](https://developers.stellar.org)
- 💬 [Discord](https://discord.gg/stellar)
- 📮 [GitHub Issues](https://github.com/stellar/ccla-soroban/issues)
- 🐦 [@StellarDev](https://twitter.com/StellarDev)

---

**CCLA is ready for production deployment on Stellar Testnet and Mainnet!**
