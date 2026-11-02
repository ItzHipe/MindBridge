# MindBridge – Automation & AI-Powered Reporting QA Lab

MindBridge is a lightweight account management web application built with Node.js, Express, EJS, and SQLite. It provides user authentication, profile viewing, and account update workflows with end-to-end Playwright automation and QA reporting.

---

## Tech Stack

- **Runtime & Backend:** Node.js, Express
- **Templating & UI:** EJS, Semantic HTML5, CSS3
- **Database:** SQLite (`better-sqlite3`)
- **Authentication:** Session-based (`express-session`), password hashing via `bcryptjs`
- **End-to-End Testing:** `@playwright/test` (Chromium)
- **Reporting:** PDFKit automated EOD PDF generation

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
PORT=3000
DATABASE_PATH=./database/mindbridge.db
SESSION_SECRET=mindbridge-dev-session-secret-local-only
TEST_USER_EMAIL=alex.johnson@mindbridge.test
TEST_USER_PASSWORD=TestPass@101
```

### 4. Database Initialization
Initialize and seed the SQLite database with test user ID 101:
```bash
npm run db:setup
```

### 5. Running the Application
```bash
npm start
```
The app will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Test Execution

### Run Playwright E2E Tests
To execute the account update automation test:
```bash
npx playwright test tests/account_update.spec.js --reporter=list
```

### Run Full Regression Suite
To run all regression tests and capture nightly logs:
```bash
npx playwright test --reporter=list
```

### Run Headed Mode
```bash
npm run test:headed
```

---

## SQL Validation

To validate the test user record in the SQLite database:
```sql
SELECT *
FROM Users
WHERE user_id = 101;
```
Or run the pre-configured script:
```bash
node -e "const db = require('better-sqlite3')('./database/mindbridge.db'); console.table(db.prepare('SELECT user_id, first_name, last_name, email, phone_number FROM Users WHERE user_id = 101').all()); db.close();"
```

---

## Deliverables & Artifacts

All required submission deliverables are organized in `Automation_Lab_Submission/`:
- `account_update.spec.js`: Playwright E2E happy path automation test
- `EndOfDay_Report.pdf`: Senior QA regression stability report
- `sql_validation.png`: SQL query and database validation screenshot
- `playwright_pass.png`: Playwright test execution passing screenshot
- `jira_link.png`: Jira user story tracking and PR link (pending Jira project configuration)
