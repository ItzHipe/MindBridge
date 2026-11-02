/**
 * database/setup.js
 * Initializes the SQLite database and seeds the test user (user_id = 101).
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const DB_PATH = path.resolve(
  __dirname,
  '..',
  process.env.DATABASE_PATH || './database/mindbridge.db'
);

// Ensure the directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    user_id       INTEGER PRIMARY KEY,
    first_name    TEXT    NOT NULL,
    last_name     TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE,
    password      TEXT    NOT NULL,
    phone_number  TEXT
  );
`);

// Seed test user 101
const testEmail = process.env.TEST_USER_EMAIL || 'alex.johnson@mindbridge.test';
const testPassword = process.env.TEST_USER_PASSWORD || 'TestPass@101';
const hash = bcrypt.hashSync(testPassword, 10);

const existing = db.prepare('SELECT user_id FROM Users WHERE user_id = 101').get();
if (!existing) {
  db.prepare(
    `INSERT INTO Users (user_id, first_name, last_name, email, password, phone_number)
     VALUES (101, 'Alex', 'Johnson', ?, ?, '555-0101')`
  ).run(testEmail, hash);
  console.log('✔  Test user 101 created.');
} else {
  // Update password in case .env changed
  db.prepare('UPDATE Users SET email = ?, password = ? WHERE user_id = 101').run(
    testEmail,
    hash
  );
  console.log('✔  Test user 101 already exists – credentials refreshed.');
}

db.close();
console.log('✔  Database ready at', DB_PATH);
