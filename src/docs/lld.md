# User Payout Management System

## Objective

The goal of this system is to manage creator earnings generated through affiliate sales and provide a reliable payout workflow.

The system should:

- Provide a 10% advance payout on pending sales.
- Handle approved and rejected sales.
- Maintain creator wallet balances.
- Allow creators to withdraw earnings.
- Recover failed withdrawals.
- Keep a history of all balance changes.

---

# System Overview

The system revolves around five core entities:

```text
User
 │
 ├── Wallet
 │
 ├── Sales
 │
 ├── Transactions
 │
 └── Withdrawals
```

### User

Represents a creator on the platform.

### Wallet

Stores the current withdrawable balance available to the creator.

### Sale

Stores affiliate sale information and payout state.

### Transaction

Maintains a history of all wallet balance changes.

### Withdrawal

Stores withdrawal requests initiated by creators.

---

# Database Design

## User

```js
{
    _id,
    name,
    email
}
```

---

## Wallet

```js
{
    _id,
    userId,
    withdrawableBalance
}
```

Each user has exactly one wallet.

Relationship:

```text
User (1) ---- (1) Wallet
```

---

## Sale

```js
{
    _id,

    userId,

    brand,

    earning,

    status,

    advancePaid,

    advancePaidAmount,

    settled
}
```

### Status

```text
PENDING
APPROVED
REJECTED
```

### Why `advancePaid`?

The advance payout processor runs periodically.

Without this field, the same sale could receive multiple advance payouts.

### Why `settled`?

Approved and rejected sales should only be processed once.

This flag prevents duplicate settlement.

---

## Transaction

```js
{
    _id,

    userId,

    saleId,

    type,

    amount
}
```

### Transaction Types

```text
ADVANCE_PAYOUT

FINAL_PAYOUT

REJECTION_ADJUSTMENT

WITHDRAWAL

FAILED_WITHDRAWAL_REFUND
```

The purpose of this collection is to maintain an audit trail of every wallet balance change.

---

## Withdrawal

```js
{
    _id,

    userId,

    amount,

    status
}
```

### Status

```text
PENDING
PROCESSING
SUCCESS
FAILED
REJECTED
```

---

# Entity Relationships

```text
User
 │
 ├── Wallet (1:1)
 │
 ├── Sales (1:N)
 │
 ├── Transactions (1:N)
 │
 └── Withdrawals (1:N)
```

---

# Advance Payout Flow

Every pending sale is eligible for a 10% advance payout.

A scheduled job periodically finds eligible sales:

```js
{
    status: "PENDING",
    advancePaid: false
}
```

For each sale:

1. Calculate advance payout.
2. Create transaction record.
3. Update wallet balance.
4. Mark sale as advance paid.

```text
Sale
  ↓
Advance Payout
  ↓
Transaction Created
  ↓
Wallet Updated
```

---

# Approved Sale Flow

When a sale becomes approved:

```text
Remaining Amount
=
Total Earning
-
Advance Paid Amount
```

The remaining amount is credited to the creator's wallet.

```text
Approved Sale
      ↓
Calculate Remaining Amount
      ↓
Create Transaction
      ↓
Update Wallet
      ↓
Mark Sale Settled
```

---

# Rejected Sale Flow

If a sale is rejected, any previously advanced amount must be recovered.

```text
Rejected Sale
      ↓
Recover Advance Amount
      ↓
Create Transaction
      ↓
Update Wallet
      ↓
Mark Sale Settled
```

---

# Withdrawal Flow

A creator can withdraw available balance.

Before creating a withdrawal:

- Wallet balance must be sufficient.
- User must not have made a successful withdrawal within the last 24 hours.

```text
Withdrawal Request
        ↓
Validate Rules
        ↓
Create Withdrawal
        ↓
Deduct Wallet Balance
```

---

# Failed Withdrawal Recovery

If a withdrawal fails, the amount is refunded back to the creator's wallet.

```text
Failed Withdrawal
        ↓
Refund Amount
        ↓
Update Wallet
        ↓
Create Transaction
```

This ensures no money is lost due to payout failures.

---

# API Design

### Create Sale

```http
POST /sales
```

Creates a new sale.

---

### Update Sale Status

```http
PATCH /sales/:id/status
```

Updates sale status to:

```text
APPROVED
REJECTED
```

---

### Create Withdrawal

```http
POST /withdrawals
```

Creates a withdrawal request.

---

### Get Wallet

```http
GET /wallet/:userId
```

Returns current wallet balance.

---

### Get Transaction History

```http
GET /transactions/:userId
```

Returns transaction history.

---

# Edge Cases Considered

### Duplicate Advance Payout

A sale should only receive advance payout once.

Handled using:

```text
advancePaid
```

---

### Duplicate Settlement

Approved or rejected sales should only be settled once.

Handled using:

```text
settled
```

---

### Multiple Withdrawals

Users are restricted to one successful withdrawal every 24 hours.

---

### Insufficient Balance

Withdrawal requests greater than available balance are rejected.

---

### Failed Withdrawal Refunds

Refund should only happen once for a failed withdrawal.

---

# Design Decisions

## Wallet + Transaction History

Wallet stores the current balance.

Transactions store the history of how that balance changed.

This allows:

- Faster balance lookups.
- Easier debugging.
- Financial traceability.

---

## Scheduled Advance Payout Processing

Advance payouts are processed through a scheduled job rather than during sale creation.

This keeps sale creation lightweight and separates payout processing from sale ingestion.

---

# Trade-offs

## Advance Payout Risk

One limitation of advance payouts is that users may withdraw funds before sales are fully reconciled.

If a sale is later rejected, the platform must recover the previously advanced amount.

Possible production-grade mitigation strategies include:

- Withdrawal holding period
- Reserve balance
- Risk scoring
- Delayed withdrawal eligibility

The current implementation follows the assignment requirements and focuses on payout reconciliation through adjustment transactions.

---

# Future Improvements

## Event-Driven Settlement

Sale status updates can trigger settlement immediately instead of relying on scheduled processing.

Benefits:

- Lower latency
- Reduced database scanning
- Faster balance updates

---

## Queue-Based Processing

For higher scale, payout processing can be moved to:

- Kafka
- RabbitMQ
- AWS SQS

to support large transaction volumes.

---

# Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Scheduler

- Node Cron