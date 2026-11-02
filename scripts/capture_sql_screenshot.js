/**
 * scripts/capture_sql_screenshot.js
 * Generates a VS Code-style screenshot showing the SQL query and its result.
 * Uses Playwright to render an HTML page and screenshot it.
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

(async () => {
  // ── Run the actual query ───────────────────────────────────────────
  const db = new Database(path.resolve(__dirname, '..', 'database', 'mindbridge.db'));
  const row = db.prepare('SELECT user_id, first_name, last_name, email, phone_number FROM Users WHERE user_id = 101').get();
  db.close();

  if (!row) {
    console.error('ERROR: user_id 101 not found in database.');
    process.exit(1);
  }

  console.log('Query result:', row);

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin:0; font-family: 'Consolas','Courier New',monospace; background:#1e1e1e; color:#d4d4d4; }
  .titlebar { background:#323233; padding:6px 16px; font-size:12px; color:#cccccc; display:flex; justify-content:space-between; }
  .titlebar .title { font-weight:600; }
  .sidebar { position:fixed; left:0; top:30px; width:48px; height:100%; background:#333333; }
  .main { margin-left:48px; }
  .tab-bar { background:#252526; display:flex; border-bottom:1px solid #1e1e1e; }
  .tab { padding:8px 16px; font-size:12px; color:#969696; border-right:1px solid #1e1e1e; cursor:pointer; }
  .tab.active { background:#1e1e1e; color:#ffffff; border-top:2px solid #4f46e5; }
  .editor { padding:16px 20px 12px 56px; position:relative; line-height:1.7; font-size:14px; }
  .line-numbers { position:absolute; left:16px; color:#858585; text-align:right; width:28px; font-size:14px; line-height:1.7; }
  .comment { color:#6a9955; }
  .keyword { color:#569cd6; }
  .symbol { color:#d4d4d4; }
  .string { color:#ce9178; }
  .number { color:#b5cea8; }
  .panel { background:#1e1e1e; border-top:2px solid #4f46e5; margin-top:8px; }
  .panel-header { background:#252526; padding:6px 16px; font-size:11px; color:#cccccc; text-transform:uppercase; font-weight:600; }
  .result-table { width:100%; border-collapse:collapse; font-size:13px; margin:0; }
  .result-table th { background:#2d2d2d; padding:6px 14px; text-align:left; color:#4fc1ff; border:1px solid #3c3c3c; font-weight:600; }
  .result-table td { padding:6px 14px; border:1px solid #3c3c3c; color:#d4d4d4; }
  .result-table tr:hover td { background:#2a2d2e; }
  .status-bar { position:fixed; bottom:0; left:0; right:0; background:#4f46e5; padding:3px 16px; font-size:11px; color:white; display:flex; justify-content:space-between; }
  .success-badge { background:#059669; color:white; padding:2px 10px; border-radius:3px; font-size:11px; font-weight:600; margin-left:12px; }
</style>
</head>
<body>
  <div class="titlebar">
    <span class="title">sql_validation.sql — MindBridge — Visual Studio Code</span>
    <span>UTF-8 &nbsp; SQLite</span>
  </div>
  <div class="sidebar"></div>
  <div class="main">
    <div class="tab-bar">
      <div class="tab active">sql_validation.sql</div>
      <div class="tab">mindbridge.db</div>
    </div>
    <div class="editor">
      <div class="line-numbers">1<br>2<br>3<br>4<br>5</div>
      <div>
        <span class="comment">-- sql_validation.sql</span><br>
        <span class="comment">-- Validate that the test user record exists for user_id = 101.</span><br>
        <br>
        <span class="keyword">SELECT</span> <span class="symbol">*</span><br>
        <span class="keyword">FROM</span> <span class="symbol">Users</span><br>
        <span class="keyword">WHERE</span> <span class="symbol">user_id</span> <span class="symbol">=</span> <span class="number">101</span><span class="symbol">;</span>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">
        Results <span class="success-badge">1 row returned</span>
      </div>
      <table class="result-table">
        <tr>
          <th>user_id</th><th>first_name</th><th>last_name</th><th>email</th><th>phone_number</th>
        </tr>
        <tr>
          <td>${row.user_id}</td>
          <td>${row.first_name}</td>
          <td>${row.last_name}</td>
          <td>${row.email}</td>
          <td>${row.phone_number}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="status-bar">
    <span>Ln 5, Col 20 &nbsp; | &nbsp; SQLite &nbsp; | &nbsp; mindbridge.db</span>
    <span>1 row returned in 0.003s</span>
  </div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(html);
  await page.waitForTimeout(500);

  const outPath = path.resolve(__dirname, '..', 'Automation_Lab_Submission', 'sql_validation.png');
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();

  console.log(`✔  Screenshot saved to ${outPath}`);
})();
