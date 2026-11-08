-- When work on a project started (stored as the first day of the month; the
-- dashboard asks for month and year only). The public stats count years of
-- experience from the earliest one. Nullable: existing projects stay as they
-- are until the owner fills in their real dates.
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS started_on DATE;
