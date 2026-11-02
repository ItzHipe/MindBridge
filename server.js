require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DATABASE_PATH || './database/mindbridge.db';

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
const db = new Database(path.resolve(__dirname, DB_PATH));
db.pragma('journal_mode = WAL');

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// Make session user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// ---------------------------------------------------------------------------
// Routes – Authentication
// ---------------------------------------------------------------------------
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
  if (!user) {
    return res.render('login', { error: 'Invalid email or password.' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.render('login', { error: 'Invalid email or password.' });
  }

  // Store user in session (omit password hash)
  req.session.user = {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
  };

  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ---------------------------------------------------------------------------
// Routes – Dashboard
// ---------------------------------------------------------------------------
app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard');
});

// ---------------------------------------------------------------------------
// Routes – Account Update
// ---------------------------------------------------------------------------
app.get('/account', requireAuth, (req, res) => {
  // Reload fresh data from DB
  const user = db
    .prepare('SELECT * FROM Users WHERE user_id = ?')
    .get(req.session.user.user_id);

  res.render('account', {
    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
    },
    success: null,
    error: null,
  });
});

app.post('/account', requireAuth, (req, res) => {
  const { first_name, last_name, email, phone_number } = req.body;
  const userId = req.session.user.user_id;

  // Basic validation
  if (!first_name || !last_name || !email) {
    const user = db.prepare('SELECT * FROM Users WHERE user_id = ?').get(userId);
    return res.render('account', {
      user: { ...user },
      success: null,
      error: 'First name, last name, and email are required.',
    });
  }

  try {
    db.prepare(
      `UPDATE Users
         SET first_name = ?, last_name = ?, email = ?, phone_number = ?
       WHERE user_id = ?`
    ).run(first_name, last_name, email, phone_number, userId);

    // Update session
    req.session.user = { user_id: userId, first_name, last_name, email, phone_number };

    res.render('account', {
      user: { user_id: userId, first_name, last_name, email, phone_number },
      success: 'Account updated successfully.',
      error: null,
    });
  } catch (err) {
    console.error('Account update error:', err);
    const user = db.prepare('SELECT * FROM Users WHERE user_id = ?').get(userId);
    res.render('account', {
      user: { ...user },
      success: null,
      error: 'An error occurred while updating your account.',
    });
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const server = app.listen(PORT, () => {
  console.log(`MindBridge running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  server.close();
});

module.exports = { app, server };
