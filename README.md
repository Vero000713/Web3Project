# Florist Prepaid Coupon (FPC) Platform

A Web3-based POC platform for florist prepaid coupon financing on Base Chain.

## Business Model

A florist needs $1,500 financing by issuing 100 prepaid coupons (FPC tokens) at $15 each. Users can purchase tokens and redeem them for 1 dozen roses. Upon redemption, the smart contract automatically distributes funds:
- $5 → Supplier
- $2 → Logistics
- $8 → Florist Shop (with 3% platform fee deducted)

## Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Routing**: React Router
- **Blockchain**: Base (Ethereum L2)
- **Future Integration**: wagmi + viem

## Pages

1. **Landing Page** (`/`) - Platform introduction and token information
2. **Buy Page** (`/buy`) - Purchase FPC tokens
3. **User Dashboard** (`/dashboard`) - User's token balance and redemption history
4. **Merchant Dashboard** (`/merchant`) - Florist's sales and fund distribution
5. **Redeem Page** (`/redeem`) - Redeem tokens for roses
6. **Compliance Page** (`/compliance`) - Wallet info and compliance details

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

## Notes

- This is a POC with placeholder wallet functionality
- Real wallet integration (wagmi) to be implemented
- Smart contract address to be provided later
