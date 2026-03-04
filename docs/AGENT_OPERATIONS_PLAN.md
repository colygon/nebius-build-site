# AgentHack — Autonomous Operations Plan

## 0) Product Definition
The goal is to run a real-world hackathon mostly autonomously with an on-call human fallback:
- **Outreach/communication**: emails, confirmations, direction help, stage changes, late submissions
- **People mgmt**: participants, speakers, mentors, sponsors
- **Event ops**: room schedule, track assignments, timezone-safe timing, reminders
- **Submissions**: intake, review, scoring, feedback, GitHub helper
- **Judging**: structured scoring + rationale + consistency checks

## 1) Data model (MVP)

- `Hackathon`
  - name, slug, dates, timezone, venue, luma/website links
- `Person`
  - name, email, phone/Slack, role (attendee/speaker/sponsor/judge/admin), preferences
- `Invite`
  - personId, kind, status, sentAt, deliveredAt, response, lastReminderAt
- `EventItem`
  - kind (talk, demo, judges, coffee, announcement), startAt/endAt, room, participants
- `Submission`
  - team, repoUrl, demoUrl, shortDeckUrl, status, tags, scores[], feedback[], issues, gitHubChecks
- `Review`
  - submissionId, rubric scores, notes, risk flags, suggested fixes

## 2) Core agent roles

- **Host Agent**
  - handles all day-of comms, reminders, venue/room updates, and attendee support
- **Sourcing Agent**
  - invite speakers/sponsors, confirm attendance, capture bios/needs
- **Flow Agent**
  - schedules event blocks, publishes changes, manages calendar invites
- **Submission Agent**
  - polls for new submissions, detects missing fields, asks for fixes
- **Judging Agent**
  - reads rubric, summarizes submission strengths/weaknesses, proposes feedback

Each action should be logged with:
- actor (`agent`), action, target id, confidence, timestamp, outcome, and human override flag.

## 3) Email automation design

- Outgoing: transactional + scheduled batch sender
- Inbound: parse incoming email replies and classify:
  - can auto-handle (`yes`, `no`, `need details`, `change time`, `issue with submission`)
  - escalate unknown/intense messages to human
- Templates:
  - registration ack
  - event confirmation
  - stage schedule update
  - speaker/sponsor reminder
  - late submission notice + checklist
  - judging feedback

## 4) Calendaring

- Use Google Calendar API v3 or ICS generation
- Rules:
  - all times stored UTC, render local with each attendee timezone
  - send reminder 48h / 4h / 10m
  - create cancel/update events with consistent subject prefix `[AgentHack]`
- Track invite status (`accepted` / `declined` / `tentative` / `no response`).

## 5) GitHub support loop

- Pull repo metadata + branch default + permissions
- Run lightweight checks:
  - presence of README, setup/run docs, dependencies installable, build/lint smoke tests
- Detect likely gaps with deterministic + heuristic checks
- Generate actionable feedback with priority and exact fix suggestions
- If explicit permission + branch/PR exists, can draft a patch assistant workflow in a separate branch

## 6) Judging system

- Rubric fields:
  - originality, execution, impact, technical quality, presentation, teamwork
- AI summary card per submission:
  - strengths
  - risks
  - missing pieces
  - suggested follow-up questions
- Human reviewer approval before final scores for borderline cases

## 7) Safety + guardrails

- No sensitive personal data logged in plain text beyond minimal contact fields
- No destructive actions without explicit human confirmation (refunds, mass deletions)
- Every autonomous email must include a clear identity signature and opt-out note
- Include a kill switch endpoint for ops pause

## 8) Milestones (first 2 weeks)

1. Week 1: rebrand site + integrate event data model + calendar + email queue
2. Week 2: submission intake + reviewer workflow + auto-feedback prototype
3. Week 3: sponsor/speaker pipeline + live schedule bot + dashboard
4. Week 4: scoring + judge tools + human fallback + launch rehearsal

## 9) Repos and ownership

- Main app: `colygon/clawhack-ai`
- Optional service modules in separate repos for isolation:
  - `clawhack-ai-agents`
  - `clawhack-ai-integrations`

## 10) Immediate next coding tasks

1. Replace visible copy and routes from old ClawHack event branding.
2. Add `.env.example` with placeholders for SMTP/API/Google Calendar/GitHub.
3. Add `data/schema.sql` and migration stubs.
4. Build first admin action APIs:
   - POST `/api/admin/invite`
   - POST `/api/admin/schedule`
   - POST `/api/admin/submission/review`
