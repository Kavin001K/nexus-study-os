-- Nexus Study OS Database Schema
-- Local SQLite Database for Development

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for auth persistence
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Knowledge nodes table
CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL CHECK(subject IN ('physics', 'chemistry', 'biology', 'math', 'history', 'polity', 'economics', 'geography')),
    exam TEXT NOT NULL CHECK(exam IN ('jee', 'neet', 'upsc')),
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    position_z REAL DEFAULT 0,
    content_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'green' CHECK(status IN ('green', 'yellow', 'red')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Room memberships
CREATE TABLE IF NOT EXISTS room_memberships (
    user_id TEXT NOT NULL,
    room_id TEXT NOT NULL,
    role TEXT DEFAULT 'member' CHECK(role IN ('admin', 'moderator', 'member')),
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    metadata TEXT, -- JSON string for additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES goal_rooms(id) ON DELETE SET NULL
);

-- Study resources
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('note', 'video', 'quiz', 'flashcard', 'mindmap')),
    content TEXT, -- JSON or markdown content
    node_id TEXT,
    room_id TEXT,
    author_id TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES knowledge_nodes(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES goal_rooms(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    node_id TEXT NOT NULL,
    progress_percent INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, node_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (node_id) REFERENCES knowledge_nodes(id) ON DELETE CASCADE
);

-- Study streaks
CREATE TABLE IF NOT EXISTS study_streaks (
    user_id TEXT PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_node_id ON resources(node_id);
CREATE INDEX IF NOT EXISTS idx_resources_room_id ON resources(room_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
