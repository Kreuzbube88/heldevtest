import Database from 'better-sqlite3';
import { initializeSchema } from './schema.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || '/app/data/heldevtest.db';
const DB_DIR = path.dirname(DB_PATH);

console.log('Database path:', DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

initializeSchema(db);

export default db;
