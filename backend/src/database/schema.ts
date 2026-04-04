import Database from 'better-sqlite3';

export function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'de',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS test_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      filename TEXT NOT NULL,
      markdown_structure TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'active',
      total_tests INTEGER NOT NULL DEFAULT 0,
      completed_tests INTEGER NOT NULL DEFAULT 0,
      passed_tests INTEGER NOT NULL DEFAULT 0,
      failed_tests INTEGER NOT NULL DEFAULT 0,
      skipped_tests INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      test_path TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      bugs TEXT NOT NULL DEFAULT '',
      duration_seconds INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
      UNIQUE(session_id, test_path)
    );

    CREATE TABLE IF NOT EXISTS screenshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      test_path TEXT NOT NULL,
      filename TEXT NOT NULL,
      data BLOB NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON test_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_results_session ON test_results(session_id);
    CREATE INDEX IF NOT EXISTS idx_screenshots_session ON screenshots(session_id);
  `);

  // Migrations: add columns that may not exist in older DBs
  try {
    db.exec(`ALTER TABLE test_sessions ADD COLUMN archived INTEGER NOT NULL DEFAULT 0`);
  } catch {
    // Column already exists
  }
}
