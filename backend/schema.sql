-- Database schema for Financial Planner MVP

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (simplified for MVP; authentication handled elsewhere)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Months data for up to 12 months per user
CREATE TABLE IF NOT EXISTS months (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month_date DATE NOT NULL,
  income NUMERIC(12,2) DEFAULT 0,
  expenses NUMERIC(12,2) DEFAULT 0,
  savings NUMERIC(12,2) DEFAULT 0,
  investments NUMERIC(12,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  UNIQUE (user_id, month_date)
);