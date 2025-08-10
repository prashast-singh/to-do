-- Initialize users database
-- The database is already created by POSTGRES_DB environment variable
-- \c users; -- This line is not needed as we're already in the users database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    User_pwd VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(user_email);

-- Create index on uuid for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 