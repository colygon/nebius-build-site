# People Ops Applications — Data Notes

The new **People Ops** section on the homepage now collects applications for:

- **judge**
- **mentor**
- **volunteer**
- **sponsors**
- **press**
- **hacker**

## API contract
Client calls: `POST /api/notify`

Request body example:

```json
{
  "type": "people_application",
  "data": {
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "role": "judge",
    "availability": ["friday", "saturday"],
    "questionOne": "...",
    "questionTwo": "...",
    "canConfirmAvailability": true
  }
}
```

## Supabase table expected
Create a table (or ensure columns exist) with at least these fields:

- `id` UUID
- `role` text
- `name` text
- `email` text
- `phone` text (nullable)
- `timezone` text
- `organization` text (nullable)
- `question_one` text
- `question_two` text
- `availability` json/jsonb or text[]
- `comments` text (nullable)
- `availability_confirmed` boolean
- `status` text (e.g., `pending`, `confirmed`, `declined`)
- `created_at` timestamptz default `now()`

## Google Sheets mapping
The `/api/notify` route syncs this form to the `People Applications` sheet tab with row columns:
1. Timestamp
2. Role
3. Name
4. Email
5. Availability
6. Availability confirmed
7. Question 1
8. Question 2
9. Timezone
