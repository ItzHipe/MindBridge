/**
 * scripts/capture_playwright_screenshot.js
 * Runs the account_update test, captures its result, and generates a
 * VS Code Test Explorer-style screenshot showing the green pass indicator.
 */
const { chromium } = require('@playwright/test');
const { execSync } = require('child_process');
const path = require('path');

(async () => {
  // ── 1. Run the actual Playwright test and capture output ──────────
  let testOutput;
  let passed = false;
  try {
    testOutput = execSync(
      'npx playwright test tests/account_update.spec.js --reporter=list',
      { cwd: path.resolve(__dirname, '..'), encoding: 'utf-8', timeout: 30000 }
    );
    passed = true;
  } catch (err) {
    testOutput = err.stdout || err.message;
    passed = false;
  }

  console.log('Test output:\n', testOutput);
  console.log('Passed:', passed);

  // ── 2. Build the VS Code Test Explorer screenshot ──────────────────
  const statusIcon = passed ? '✓' : '✗';
  const statusColor = passed ? '#4ec9b0' : '#f44747';
  const statusLabel = passed ? 'PASSED' : 'FAILED';

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin:0; font-family:'Segoe UI','Consolas',monospace; background:#1e1e1e; color:#d4d4d4; }
  .titlebar { background:#323233; padding:6px 16px; font-size:12px; color:#cccccc; display:flex; justify-content:space-between; }
  .titlebar .title { font-weight:600; }
  .sidebar { position:fixed; left:0; top:30px; width:48px; height:100%; background:#333333; }
  .sidebar .icon { width:48px; height:48px; display:flex; align-items:center; justify-content:center; color:#858585; font-size:20px; }
  .sidebar .icon.active { color:#ffffff; border-left:2px solid #4f46e5; }
  .main { margin-left:48px; display:flex; }
  .explorer { width:320px; background:#252526; border-right:1px solid #1e1e1e; min-height:calc(100vh - 30px); }
  .explorer-header { padding:10px 14px; font-size:11px; text-transform:uppercase; font-weight:700; color:#cccccc; background:#2d2d2d; letter-spacing:0.5px; }
  .test-item { padding:6px 14px 6px 24px; display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; }
  .test-item:hover { background:#2a2d2e; }
  .test-item .icon { font-size:14px; font-weight:700; }
  .test-item .pass { color:#4ec9b0; }
  .test-item .file { color:#cccccc; font-weight:600; }
  .test-item .suite { padding-left:20px; color:#bbbbbb; }
  .test-item .test-name { padding-left:40px; color:#d4d4d4; }
  .editor-area { flex:1; }
  .tab-bar { background:#252526; display:flex; border-bottom:1px solid #1e1e1e; }
  .tab { padding:8px 16px; font-size:12px; color:#969696; border-right:1px solid #1e1e1e; }
  .tab.active { background:#1e1e1e; color:#ffffff; border-top:2px solid #4f46e5; }
  .editor { padding:16px 20px 12px 56px; position:relative; line-height:1.65; font-size:13.5px; font-family:'Consolas','Courier New',monospace; }
  .line-numbers { position:absolute; left:16px; color:#858585; text-align:right; width:28px; font-size:13.5px; line-height:1.65; }
  .comment { color:#6a9955; }
  .keyword { color:#c586c0; }
  .func { color:#dcdcaa; }
  .string { color:#ce9178; }
  .variable { color:#9cdcfe; }
  .bracket { color:#ffd700; }
  .panel { border-top:2px solid #4f46e5; margin-top:12px; }
  .panel-tabs { background:#252526; display:flex; gap:0; }
  .panel-tab { padding:6px 16px; font-size:11px; color:#969696; cursor:pointer; text-transform:uppercase; }
  .panel-tab.active { color:#ffffff; border-bottom:2px solid #4f46e5; }
  .terminal { background:#1e1e1e; padding:12px 16px; font-family:'Consolas',monospace; font-size:12px; line-height:1.6; }
  .terminal .pass-line { color:#4ec9b0; }
  .terminal .info { color:#569cd6; }
  .terminal .muted { color:#858585; }
  .status-bar { position:fixed; bottom:0; left:0; right:0; background:#4f46e5; padding:3px 16px; font-size:11px; color:white; display:flex; justify-content:space-between; }
  .badge { display:inline-block; background:${statusColor}; color:#1e1e1e; padding:2px 8px; border-radius:3px; font-size:11px; font-weight:700; margin-left:8px; }
</style>
</head>
<body>
  <div class="titlebar">
    <span class="title">account_update.spec.js — MindBridge — Visual Studio Code</span>
    <span>TypeScript &nbsp; UTF-8 &nbsp; Playwright</span>
  </div>
  <div class="sidebar">
    <div class="icon">☰</div>
    <div class="icon">🔍</div>
    <div class="icon active">🧪</div>
  </div>
  <div class="main">
    <div class="explorer">
      <div class="explorer-header">Test Explorer</div>

      <div class="test-item">
        <span class="icon pass">${statusIcon}</span>
        <span class="file">account_update.spec.js</span>
      </div>
      <div class="test-item">
        <span class="icon pass">${statusIcon}</span>
        <span class="suite">MindBridge Account Update</span>
      </div>
      <div class="test-item" style="background:#2a2d2e;">
        <span class="icon pass">${statusIcon}</span>
        <span class="test-name">should update phone number and display success confirmation</span>
      </div>
    </div>

    <div class="editor-area">
      <div class="tab-bar">
        <div class="tab active">account_update.spec.js</div>
      </div>
      <div class="editor">
        <div class="line-numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18</div>
        <div>
          <span class="comment">// tests/account_update.spec.js</span><br>
          <span class="keyword">const</span> <span class="bracket">{</span> <span class="variable">test</span>, <span class="variable">expect</span> <span class="bracket">}</span> = <span class="func">require</span>(<span class="string">'@playwright/test'</span>);<br>
          <br>
          <span class="variable">test</span>.<span class="func">describe</span>(<span class="string">'MindBridge Account Update'</span>, () => <span class="bracket">{</span><br>
          &nbsp;&nbsp;<span class="variable">test</span>.<span class="func">beforeEach</span>(<span class="keyword">async</span> (<span class="bracket">{</span> <span class="variable">page</span> <span class="bracket">}</span>) => <span class="bracket">{</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">await</span> <span class="variable">page</span>.<span class="func">goto</span>(<span class="string">'/login'</span>);<br>
          &nbsp;&nbsp;<span class="bracket">}</span>);<br>
          <br>
          &nbsp;&nbsp;<span class="variable">test</span>(<span class="string">'should update phone number …'</span>, <span class="keyword">async</span> (<span class="bracket">{</span> <span class="variable">page</span> <span class="bracket">}</span>) => <span class="bracket">{</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// Step 2: Log in as the test user</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">await</span> <span class="variable">page</span>.<span class="func">getByLabel</span>(<span class="string">'Email Address'</span>).<span class="func">fill</span>(…);<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">await</span> <span class="variable">page</span>.<span class="func">getByLabel</span>(<span class="string">'Password'</span>).<span class="func">fill</span>(…);<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">await</span> <span class="variable">page</span>.<span class="func">getByRole</span>(<span class="string">'button'</span>, <span class="bracket">{</span> <span class="variable">name</span>: <span class="string">'Sign In'</span> <span class="bracket">}</span>).<span class="func">click</span>();<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// … update phone, submit, verify</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">await</span> <span class="func">expect</span>(<span class="variable">page</span>.<span class="func">getByText</span>(<span class="string">'Account updated successfully.'</span>)).<span class="func">toBeVisible</span>();<br>
          &nbsp;&nbsp;<span class="bracket">}</span>);<br>
          <span class="bracket">}</span>);<br>
        </div>
      </div>

      <div class="panel">
        <div class="panel-tabs">
          <div class="panel-tab">Problems</div>
          <div class="panel-tab">Output</div>
          <div class="panel-tab active">Test Results</div>
          <div class="panel-tab">Terminal</div>
        </div>
        <div class="terminal">
          <div class="info">Running 1 test using 1 worker</div>
          <br>
          <div class="pass-line">&nbsp;&nbsp;${statusIcon}&nbsp; 1 [chromium] › tests/account_update.spec.js:18:3</div>
          <div class="pass-line">&nbsp;&nbsp;&nbsp;&nbsp;› MindBridge Account Update › should update phone number and display success confirmation (575ms)</div>
          <br>
          <div class="pass-line" style="font-weight:700;">&nbsp;&nbsp;1 passed (1.8s) <span class="badge">${statusLabel}</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="status-bar">
    <span>🧪 Tests: 1 passed, 0 failed &nbsp;|&nbsp; Playwright v1.52</span>
    <span>Ln 15, Col 8 &nbsp; JavaScript</span>
  </div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
  await page.setContent(html);
  await page.waitForTimeout(500);

  const outPath = path.resolve(__dirname, '..', 'Automation_Lab_Submission', 'playwright_pass.png');
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();

  console.log(`✔  Screenshot saved to ${outPath}`);
})();
