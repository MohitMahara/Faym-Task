# User Payout Management System

A low-level design and implementation of a creator payout management system that handles:

- Advance payouts (10% of sale earnings)
- Sale reconciliation (Approved / Rejected)
- Wallet management
- Withdrawal processing
- Failed payout recovery
- Transaction history tracking

---

## Key Features

### Advance Payout Processing

Eligible pending sales receive a 10% advance payout.

### Sale Reconciliation

- Approved sales receive final settlement.
- Rejected sales recover previously advanced payouts.

### Withdrawal Management

- Users can withdraw available balance.
- Only one withdrawal is allowed every 24 hours.

### Failed Withdrawal Recovery

Failed withdrawals are automatically refunded back to the user's wallet.

---

## System Overview

The system consists of the following entities:

| Entity | Responsibility |
|----------|---------------|
| User | Represents a creator on the platform |
| Wallet | Stores current withdrawable balance |
| Sale | Stores affiliate sale information |
| Transaction | Maintains audit trail of balance changes |
| Withdrawal | Stores creator payout requests |

---

## Core Design Decisions

### Wallet + Transaction History

Wallet stores the current balance.

Transactions store the complete audit trail of every balance change.

### Advance Payout Protection

Duplicate payouts are prevented using:

- advancePaid flag
- settled flag

### Withdrawal Protection

Users are restricted to one withdrawal every 24 hours.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Node Cron

---