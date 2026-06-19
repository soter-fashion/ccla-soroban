# CCLA Quick Start Guide

**Get the Cross-Chain Liquidity Aggregator running in 15 minutes!**

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 min)

```bash
# 1. Rust + Soroban
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install soroban-cli

# 2. Node.js 18+
# Download from https://nodejs.org

# Verify installations
rustc --version
node --version
soroban --version
```

### Step 2: Clone & Build (3 min)

```bash
git clone https://github.com/stellar/ccla-soroban.git
cd ccla-soroban

# Build smart contract
cd contracts
cargo build --release --target wasm32-unknown-unknown
cd ..

# Install frontend
cd frontend
npm install
cd ..
```

---

## 🚀 Deploy to Testnet (5-10 min)

```bash
# Create/fund a test account at:
# https://lab.stellar.org → Create keypair
# https://friendbot.stellar.org → Fund with XLM

export YOUR_PUBLIC_KEY="GBRPYHIL2CI3WHZDTOOQFC6EB4NCSK5EXTZLQ2IJLGYBY7HQWBMBTMY"

# Deploy contract
./deploy/deploy.sh

# Saves contract ID to .env.local
cat .env.local
```

---

## 🎨 Run Frontend Locally

```bash
cd frontend

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_CONTRACT_ID=<contract-id-from-deploy>
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
EOF

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 🧪 Run Tests

```bash
cd contracts

# Run all tests
cargo test --all

# Run specific test
cargo test pool_registry

# With logging
RUST_LOG=debug cargo test --all -- --nocapture
```

---

## 📊 Project Structure

```
ccla-soroban/
├── contracts/          ← Smart contract (Rust)
├── frontend/           ← Web UI (Next.js)
├── deploy/             ← Deployment scripts
├── docs/               ← Full documentation
└── README.md           ← Detailed guide
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `contracts/src/lib.rs` | Main contract |
| `contracts/src/types.rs` | Data structures |
| `contracts/src/routing.rs` | Swap algorithm |
| `frontend/app/swap/page.tsx` | Swap UI |
| `deploy/deploy.sh` | Deployment script |

---

## 💡 Common Tasks

### Register a Pool

```bash
soroban contract invoke \
  --network testnet \
  --id $CONTRACT_ID \
  -- register_pool \
  --pool_address CAAAA... \
  --token_a GBBD... \
  --token_b GBBC... \
  --dex_name "Stellar Swap"
```

### Get a Quote

```bash
soroban contract invoke \
  --network testnet \
  --id $CONTRACT_ID \
  -- get_quote \
  --token_in GBBD... \
  --token_out GBBC... \
  --amount_in 1000000
```

### Execute Swap

```bash
soroban contract invoke \
  --network testnet \
  --id $CONTRACT_ID \
  -- swap \
  --token_in GBBD... \
  --token_out GBBC... \
  --amount_in 1000000 \
  --min_amount_out 950000 \
  --user $YOUR_ADDRESS
```

---

## 🐛 Troubleshooting

### "soroban: command not found"
```bash
# Reinstall soroban-cli
cargo install soroban-cli --locked
```

### "WASM not found"
```bash
# Rebuild contracts
cd contracts && cargo build --release --target wasm32-unknown-unknown
```

### Frontend won't connect
1. Check contract ID is correct in `.env.local`
2. Verify RPC URL is accessible
3. Check browser console for errors

### Tests failing
```bash
# Update dependencies
cargo update

# Run tests with logging
RUST_BACKTRACE=1 cargo test --all
```

---

## 📚 Learn More

- **Full README**: `docs/README.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **Deployment**: `docs/DEPLOYMENT_GUIDE.md`
- **API Reference**: `docs/API_REFERENCE.md`

---

## 🎯 Next Steps

1. ✅ Deploy contract to Testnet
2. ✅ Register test pools
3. ✅ Execute test swaps
4. ✅ Try frontend UI
5. ✅ Run full test suite
6. ✅ Review documentation
7. ✅ Set up your own instance

---

## 🆘 Need Help?

- 📖 [Stellar Docs](https://developers.stellar.org)
- 💬 [Discord Community](https://discord.gg/stellar)
- 🐛 [GitHub Issues](https://github.com/stellar/ccla-soroban/issues)

---

## ✨ You're All Set!

You now have a fully functional DEX aggregator running on Stellar Testnet.

**Next**: Read the full documentation and start building with CCLA!
