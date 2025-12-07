import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../ami_real.db');
const db = new Database(dbPath);

export function initDb() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, -- Stub for real auth
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY, -- UUID or hardware ID
      user_id INTEGER NOT NULL,
      public_key TEXT NOT NULL,
      model TEXT,
      revoked BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contents (
      content_id TEXT PRIMARY KEY, -- UUID
      content_hash TEXT NOT NULL,
      phash TEXT NOT NULL,
      device_id TEXT NOT NULL,
      device_signature TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      trust_level TEXT DEFAULT 'ORIGINAL',
      media_type TEXT,
      owner_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(device_id) REFERENCES devices(id)
    );

    CREATE TABLE IF NOT EXISTS revocations (
      device_id TEXT PRIMARY KEY,
      reason TEXT,
      revoked_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
    console.log('Database initialized at', dbPath);
}

export default db;
