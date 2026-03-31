-- Migration: Add columns needed for Bodyncraft auth integration
-- Run this in Supabase SQL Editor after creating initial tables

-- Add missing columns to user_stats
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS total_xp INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS evolution_stage INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS unlocked_zones JSONB DEFAULT '["forest"]';
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS defeated_bosses JSONB DEFAULT '[]';
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS skill_points INT DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"strength":0,"endurance":0,"core":0,"overall":0}';
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS weight INT DEFAULT 70;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS height INT DEFAULT 170;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS age INT DEFAULT 25;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'male';
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS activity_level FLOAT DEFAULT 1.2;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Optional: Add indexes for performance (if not already added)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
