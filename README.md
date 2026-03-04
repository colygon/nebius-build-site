# AgentHack

An autonomous hackathon operations platform where an agent (you) can handle scheduling, communications, and judging as if it were your human event lead.

## Purpose

Launch "AgentHack" as a full lifecycle hackathon assistant with capability to:

- onboard and coordinate participants
- send and track confirmation/status emails
- manage stage schedule and live updates
- invite/confirm speakers and sponsors
- issue and track calendar invites
- collect submissions and keep participants in the loop
- assist with review/judging and feedback at submission level
- suggest fixes/patches for submitted GitHub repos

## Repo origin

This project started from an existing event site baseline and is now being repurposed toward autonomous, AI-led event operations.

## Current status

- ✅ New repo created: `colygon/clawhack-ai`
- ✅ New local project folder: `clawhack-ai`
- ✅ Initial scaffold copied from prior `clawsout` event app
- ✅ People Ops application flow added (Judges/Mentors/Volunteers/Staff) with confirmation + availability data capture
- ✅ Money tracking scaffold added (sponsorship packages + vendor/food order logging under /ops).
- 🎯 Next: re-platform into agent-first workflow and API orchestration

## Quick start (local)

```bash
cd clawhack-ai
npm install
npm run dev
```

Set env vars in `.env.local` (or `.env` for your hosting) as needed. For now, use placeholders until integrations are wired.

## Where we’re heading (high-level)

### Phase 1 — Core platform
- Rebrand UI and content from ClawHack → AgentHack
- Create canonical event data model (participants, tracks, judges, schedules, submission state)
- Build admin dashboard for status snapshots and one-click actions
- Add webhook + inbound email intake

### Phase 2 — Agent actions
- Assistant role orchestration for:
  - scheduler (calendars + reminders)
  - outreach (emails + replies)
  - hacker support (directions/help desk)
  - speaker + sponsor relations
  - judging and feedback loops
- Add action logs and confidence tags for every autonomous decision
- Add human-in-the-loop override for sensitive actions

### Phase 3 — Autonomous judging loop
- Review rubric scoring model
- GitHub submission fetch + static checks + lint/build smoke checks
- AI-assisted issue/feedback generation
- Human handoff queue for edge cases

## Repo setup for growth

- `docs/` contains implementation plans and data contracts
- `src/` currently holds a Next.js web app you can turn into the event dashboard + public pages
- Integrations should be added as adapters in small modules so they’re easy to replace and test
