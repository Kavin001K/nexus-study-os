-- Nexus Study OS Database Schema (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Keeping TEXT to support Google IDs or custom strings
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table for auth persistence
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Knowledge nodes table
CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id TEXT PRIMARY KEY, -- 'physics', 'math' etc.
    name TEXT NOT NULL,
    subject TEXT NOT NULL CHECK(subject IN ('physics', 'chemistry', 'biology', 'math', 'history', 'polity', 'economics', 'geography')),
    exam TEXT NOT NULL CHECK(exam IN ('jee', 'neet', 'upsc')),
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    position_z REAL DEFAULT 0,
    content_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'green' CHECK(status IN ('green', 'yellow', 'red')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Node connections (many-to-many)
CREATE TABLE IF NOT EXISTS node_connections (
    from_node_id TEXT NOT NULL,
    to_node_id TEXT NOT NULL,
    strength REAL DEFAULT 1.0,
    PRIMARY KEY (from_node_id, to_node_id),
    FOREIGN KEY (from_node_id) REFERENCES knowledge_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (to_node_id) REFERENCES knowledge_nodes(id) ON DELETE CASCADE
);

-- Goal rooms table
CREATE TABLE IF NOT EXISTS goal_rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    exam TEXT NOT NULL CHECK(exam IN ('jee', 'neet', 'upsc')),
    member_count INTEGER DEFAULT 0,
    content_count INTEGER DEFAULT 0,
    activity_level TEXT DEFAULT 'medium' CHECK(activity_level IN ('high', 'medium', 'low')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room memberships
CREATE TABLE IF NOT EXISTS room_memberships (
    user_id TEXT NOT NULL,
    room_id TEXT NOT NULL,
    role TEXT DEFAULT 'member' CHECK(role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, room_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES goal_rooms(id) ON DELETE CASCADE
);

-- Activity feed table
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    room_id TEXT,
    room_name TEXT,
    metadata JSONB, -- Postgres JSONB
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES goal_rooms(id) ON DELETE SET NULL
);

-- Study resources
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('note', 'video', 'quiz', 'flashcard', 'mindmap')),
    content JSONB, -- Content as JSONB
    node_id TEXT,
    room_id TEXT,
    author_id TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (node_id) REFERENCES knowledge_nodes(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES goal_rooms(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_node_id ON resources(node_id);
CREATE INDEX IF NOT EXISTS idx_resources_room_id ON resources(room_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
