# Telegram Bot Workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Telegram Bot Server                      │
│                         (bot.js)                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Users     │  │    Orders    │  │  Bot Logic   │     │
│  │  (Map)       │  │   (Map)      │  │  (Handlers)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Telegram API
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────▼────┐                          ┌────▼────┐
   │  Users  │                          │ Couriers│
   │ (Role)  │                          │ (Role)  │
   └─────────┘                          └─────────┘
```

## User Journey Flow

### 1. User Registration & Order Creation

```
User                    Bot                      System
 │                       │                         │
 ├──── /start ──────────>│                         │
 │<──── Welcome ─────────┤                         │
 │                       │                         │
 ├──── /register ───────>│                         │
 │                       ├──── Save User ─────────>│
 │<──── Success ─────────┤                         │
 │                       │                         │
 ├──── /neworder ───────>│                         │
 │<──── Prompt ──────────┤                         │
 │                       │                         │
 ├──── "Pizza..." ──────>│                         │
 │                       ├──── Create Order ──────>│
 │<──── Order #1 ────────┤                         │
 │      Created          │                         │
 │                       │                         │
```

### 2. Courier Registration & Order Acceptance

```
Courier                 Bot                      System
 │                       │                         │
 ├──── /start ──────────>│                         │
 │<──── Welcome ─────────┤                         │
 │                       │                         │
 ├─ /register_courier ──>│                         │
 │                       ├──── Save Courier ──────>│
 │<──── Success ─────────┤                         │
 │                       │                         │
 │<─ New Order Notif. ───┤<──── Notify ───────────┤
 │    (from user)        │      Couriers          │
 │                       │                         │
 ├─ /available_orders ──>│                         │
 │<──── Order List ──────┤                         │
 │                       │                         │
 ├──── /accept_order ───>│                         │
 │<──── Enter ID ────────┤                         │
 │                       │                         │
 ├──── "1" ─────────────>│                         │
 │                       ├─ Assign Order ─────────>│
 │<──── Accepted ────────┤                         │
 │                       │                         │
```

### 3. Order Fulfillment Flow

```
Courier                 Bot                User
 │                       │                  │
 ├─ /my_deliveries ─────>│                  │
 │<─ Active Orders ──────┤                  │
 │                       │                  │
 ├─ /complete_order ────>│                  │
 │<─ Enter ID ───────────┤                  │
 │                       │                  │
 ├─── "1" ──────────────>│                  │
 │<─ Completed ──────────┤                  │
 │                       ├─ Delivered! ────>│
 │                       │  Notification    │
```

## Order Status Flow

```
┌──────────┐
│ PENDING  │ ◄─── User creates order
└────┬─────┘
     │
     │ Courier accepts
     ▼
┌──────────┐
│ ASSIGNED │
└────┬─────┘
     │
     │ (Reserved for future use)
     ▼
┌──────────┐
│IN_PROGRESS│
└────┬─────┘
     │
     │ Courier completes
     ▼
┌──────────┐
│ DELIVERED│
└──────────┘

At any point (before DELIVERED):
    User can cancel ───> CANCELLED
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│              User sends /neworder                │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│         Bot prompts for order details            │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│      User sends "Pizza, Main St 123"            │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│  Bot creates Order object in orders Map         │
│  {                                               │
│    id: 1,                                        │
│    userId: 12345,                                │
│    details: "Pizza, Main St 123",                │
│    status: "PENDING",                            │
│    courierId: null                               │
│  }                                               │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌──────────────┐        ┌──────────────┐
│ Notify User  │        │Notify All    │
│ "Order #1    │        │Couriers      │
│  Created"    │        │"New Order!"  │
└──────────────┘        └──────────────┘
```

## Notification Flow

```
┌──────────────────────────────────────────────────┐
│              Event: Order Created                 │
└──────────────┬───────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
  ┌─────────┐      ┌──────────┐
  │  User   │      │ Couriers │
  │ (Creator)│     │  (All)   │
  └─────────┘      └──────────┘
       │                │
       │                │
       ▼                ▼
  "Order #1        "New order
   created!"         available!"

┌──────────────────────────────────────────────────┐
│            Event: Order Accepted                  │
└──────────────┬───────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
  ┌─────────┐      ┌──────────┐
  │  User   │      │ Courier  │
  │ (Creator)│     │(Accepter)│
  └─────────┘      └──────────┘
       │                │
       │                │
       ▼                ▼
  "Courier          "You accepted
   accepted!"         order #1"

┌──────────────────────────────────────────────────┐
│            Event: Order Delivered                 │
└──────────────┬───────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
  ┌─────────┐      ┌──────────┐
  │  User   │      │ Courier  │
  │ (Creator)│     │(Deliverer)│
  └─────────┘      └──────────┘
       │                │
       │                │
       ▼                ▼
  "Order #1         "Order #1
   delivered!"        completed!"
```

## Role-Based Command Access

```
┌────────────────────────────────────────────────┐
│              All Users (No Role)                │
├────────────────────────────────────────────────┤
│  /start                                         │
│  /help                                          │
│  /register                                      │
│  /register_courier                              │
└────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐      ┌──────────────────┐
│     USER     │      │     COURIER      │
├──────────────┤      ├──────────────────┤
│ /myinfo      │      │ /myinfo          │
│ /neworder    │      │ /available_orders│
│ /myorders    │      │ /accept_order    │
│ /cancelorder │      │ /my_deliveries   │
│              │      │ /complete_order  │
└──────────────┘      └──────────────────┘
```

## Error Handling Flow

```
User Input
    │
    ▼
┌─────────────┐
│  Validation │
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
   ▼        ▼
[Valid]  [Invalid]
   │        │
   │        └──> Send error message
   │             (e.g., "Invalid order ID")
   │
   ▼
Process Command
   │
   ▼
Check Permissions
   │
   ├──> [No Permission] ──> Error message
   │
   ▼
Execute Action
   │
   ├──> [Success] ──> Confirmation
   │
   └──> [Failure] ──> Error message
```

## Future Enhancements

```
Current (In-Memory)          Future (With Database)
┌─────────────┐             ┌─────────────┐
│    Bot      │             │    Bot      │
│  (Maps)     │             │   (Logic)   │
└─────────────┘             └──────┬──────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │  Database   │
                            │  (MongoDB/  │
                            │ PostgreSQL) │
                            └─────────────┘

Current                     Future
- No persistence            - Persistent storage
- Lost on restart           - Survives restarts
- Good for testing          - Production ready
- Fast access               - Scalable
```
