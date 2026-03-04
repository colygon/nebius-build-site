# Sponsorship & Vendor Finance Tracking (MVP)

Use these tables for the Ops tracker in `/ops`.

## Table: `sponsorship_transactions`

Capture sponsor money + package commitments.

| column | type | notes |
|---|---|---|
| `id` | `uuid` | primary key default `gen_random_uuid()` |
| `sponsor_name` | `text` | required |
| `sponsor_email` | `text` | nullable |
| `sponsor_package` | `text` | e.g. `Community`, `Growth`, `Partner`, `Title` |
| `pledged_usd` | `numeric` | nullable |
| `paid_usd` | `numeric` | nullable/0 |
| `status` | `text` | `pledged`, `confirmed`, `paid`, `invoice_sent` |
| `notes` | `text` | nullable |
| `created_at` | `timestamptz` | `now()` |

## Table: `food_vendors`

Track vendors for food/catering.

| column | type | notes |
|---|---|---|
| `id` | `uuid` | primary key |
| `name` | `text` | required |
| `category` | `text` | e.g. `Food` |
| `contact_name` | `text` | nullable |
| `contact_email` | `text` | nullable |
| `phone` | `text` | nullable |
| `website` | `text` | nullable |
| `notes` | `text` | nullable |
| `created_at` | `timestamptz` | `now()` |

## Table: `food_orders`

Log and track food orders.

| column | type | notes |
|---|---|---|
| `id` | `uuid` | primary key |
| `vendor_id` | `uuid` | FK -> `food_vendors(id)` |
| `order_reference` | `text` | nullable |
| `items` | `text` | required |
| `quantity` | `integer` | default 1 |
| `unit_cost_usd` | `numeric` | nullable |
| `total_cost_usd` | `numeric` | nullable |
| `event_time` | `text` | nullable |
| `status` | `text` | `planned`/`ordered`/`delivered` |
| `notes` | `text` | nullable |
| `created_at` | `timestamptz` | `now()` |

## SQL (Quick start)

```sql
create extension if not exists pgcrypto;

create table if not exists sponsorship_transactions (
  id uuid primary key default gen_random_uuid(),
  sponsor_name text not null,
  sponsor_email text,
  sponsor_package text,
  pledged_usd numeric,
  paid_usd numeric,
  status text default 'pledged',
  notes text,
  created_at timestamptz default now()
);

create table if not exists food_vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'Food',
  contact_name text,
  contact_email text,
  phone text,
  website text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists food_orders (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references food_vendors(id) on delete set null,
  order_reference text,
  items text not null,
  quantity integer default 1,
  unit_cost_usd numeric,
  total_cost_usd numeric,
  event_time text,
  status text default 'planned',
  notes text,
  created_at timestamptz default now()
);
```

## Optional webhooks

If you have an automation pipeline for real-time order placement, add:

```bash
NEXT_PUBLIC_FOOD_ORDER_WEBHOOK_URL=https://.../webhook
```

The `Ops` page sends a payload only after the order row is created.
