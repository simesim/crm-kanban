/*
  This migration became obsolete.
  Current schema already uses "passwordHash" and "role".
  We keep this file only to preserve migration history.
*/

-- Make it safe for fresh databases and shadow database
ALTER TABLE "User" DROP COLUMN IF EXISTS "password";