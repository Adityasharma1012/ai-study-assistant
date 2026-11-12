const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const DIST_DIR = path.join(__dirname, 'dist');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const PORT = 3456;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  let filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capture() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  const BASE_URL = `http://localhost:${PORT}`;

  try {
    // 1. Login Screen
    console.log('Capturing: 01_login_screen.png');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_login_screen.png') });

    // 2. Set authenticated session directly and reload
    console.log('Authenticating as Aditya Sharma...');
    await page.evaluate(() => {
      localStorage.setItem('study_assistant_auth_session', JSON.stringify({
        id: 'user_aditya_1',
        name: 'Aditya Sharma',
        email: 'aditya.sharma@university.edu',
        avatarInitials: 'AS',
        major: 'B.Tech Computer Science & Engineering',
        semester: 'Semester 5',
      }));
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1000);

    // 3. Dashboard (Light Mode)
    console.log('Capturing: 02_dashboard.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_dashboard.png') });

    // 4. Dashboard (Dark Mode)
    console.log('Toggling dark mode...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Toggle Theme"]');
      if (btn) btn.click();
    });
    await sleep(500);
    console.log('Capturing: 03_dashboard_dark.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_dashboard_dark.png') });
    // Switch back to light
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Toggle Theme"]');
      if (btn) btn.click();
    });
    await sleep(500);

    // Helper to click sidebar tab
    async function clickTab(label) {
      await page.evaluate((lbl) => {
        const btns = Array.from(document.querySelectorAll('aside button'));
        const target = btns.find((b) => b.innerText && b.innerText.toLowerCase().includes(lbl.toLowerCase()));
        if (target) target.click();
      }, label);
      await sleep(1000);
    }

    // 5. AI Assistant View
    console.log('Navigating to AI Assistant...');
    await clickTab('AI Assistant');
    // Click suggested question: "Explain binary search simply."
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chip = btns.find((b) => b.textContent.includes('Explain binary search simply'));
      if (chip) chip.click();
    });
    console.log('Waiting for AI response...');
    await sleep(2500);
    console.log('Capturing: 04_ai_assistant_chat.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_ai_assistant_chat.png') });

    // 6. Notes Generator View
    console.log('Navigating to Notes Generator...');
    await clickTab('Notes Generator');
    // Click suggested topic: "Dynamic Programming & Memoization"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chip = btns.find((b) => b.textContent.includes('Dynamic Programming'));
      if (chip) chip.click();
    });
    console.log('Waiting for Notes generation...');
    await sleep(2500);
    console.log('Capturing: 05_notes_generator.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_notes_generator.png') });

    // 7. Quiz Generator View
    console.log('Navigating to Quiz Generator...');
    await clickTab('Quiz Generator');
    // Click suggested quiz topic
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const chip = btns.find((b) => b.textContent.includes('Dynamic Programming'));
      if (chip) chip.click();
    });
    console.log('Waiting for Quiz generation...');
    await sleep(2000);
    console.log('Capturing: 06_quiz_generator_taking.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_quiz_generator_taking.png') });

    // Answer questions and view results
    for (let q = 0; q < 5; q++) {
      await page.evaluate(() => {
        const optionBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
          b.className.includes('border') && b.querySelector('div')
        );
        if (optionBtns.length > 0) {
          optionBtns[0].click();
        }
      });
      await sleep(300);

      await page.evaluate(() => {
        const actionBtn = Array.from(document.querySelectorAll('button')).find(
          (b) => b.textContent.includes('Next Question') || b.textContent.includes('Submit Quiz')
        );
        if (actionBtn) actionBtn.click();
      });
      await sleep(600);
    }
    console.log('Capturing: 07_quiz_results.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_quiz_results.png') });

    // 8. Study Planner View
    console.log('Navigating to Study Planner...');
    await clickTab('Study Planner');
    console.log('Capturing: 08_study_planner.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_study_planner.png') });

    // 9. Progress View
    console.log('Navigating to Progress...');
    await clickTab('Progress');
    console.log('Capturing: 09_progress_analytics.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_progress_analytics.png') });

    // 10. Subjects View
    console.log('Navigating to Subjects...');
    await clickTab('Subjects');
    console.log('Capturing: 10_subjects_management.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_subjects_management.png') });

    // 11. Resources View
    console.log('Navigating to Resources...');
    await clickTab('Resources');
    console.log('Capturing: 11_resources_library.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_resources_library.png') });

    // 12. Settings View
    console.log('Navigating to Settings...');
    await clickTab('Settings');
    console.log('Capturing: 12_settings_view.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_settings_view.png') });

    // 13. Mobile View (Simulating Android App)
    console.log('Setting mobile viewport (Android size: 393 x 852)...');
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await clickTab('Dashboard');
    await sleep(800);
    console.log('Capturing: 13_android_app_dashboard.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_android_app_dashboard.png') });

    // Mobile Menu Drawer
    console.log('Opening mobile drawer...');
    await page.evaluate(() => {
      const hamburger = document.querySelector('button[aria-label="Open Sidebar"]');
      if (hamburger) hamburger.click();
    });
    await sleep(600);
    console.log('Capturing: 14_android_app_menu.png');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_android_app_menu.png') });

    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
    server.close();
    console.log('Browser and server closed.');
  }
}

capture();
