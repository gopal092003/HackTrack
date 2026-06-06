-- ============================================================
-- HackTrack v2 — Database Migration
--
-- Run this in your Supabase SQL editor.
-- This is additive — it does NOT drop existing data.
-- ============================================================


-- ─── 1. Add new columns to hackathons ────────────────────────
--     These are nullable so existing rows are unaffected.

alter table hackathons
  add column if not exists project_name text,
  add column if not exists learning     text;


-- ─── 2. Update the hackathons_view to include new columns ────
--     The view previously selected * — recreating ensures the
--     new columns are included in the view.

create or replace view hackathons_view as
select
  *,
  case
    when now() < start_time then 'Upcoming'
    when now() > end_time   then 'Completed'
    else                         'Live'
  end as status
from hackathons;


-- ─── 3. Optional: add an index on project_name ───────────────
--     Helps with search queries filtering by project.

create index if not exists idx_hackathons_project_name
  on hackathons(project_name);


-- ─── Done ────────────────────────────────────────────────────
-- The journal column already exists from v1.
-- In v2, it is stored as a JSON string with this shape:
--   {
--     "goal": "...",
--     "approach": "...",
--     "challenges": "...",
--     "outcome": "...",
--     "retrospective": "..."
--   }
-- No schema change needed — the column type remains text.
-- ============================================================
