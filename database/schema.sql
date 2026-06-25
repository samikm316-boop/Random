-- Focus Plus Database Schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    profile_pic TEXT,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    streak INT DEFAULT 0,
    last_active_date DATE,
    location_status VARCHAR(50) DEFAULT 'Outside',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE xp_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    xp_gained INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_enhanced BOOLEAN DEFAULT FALSE,
    ai_metadata JSONB,
    audio_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flashcards (
    id SERIAL PRIMARY KEY,
    note_id INT REFERENCES notes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    note_id INT REFERENCES notes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    saved_state JSONB,
    last_feedback JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
