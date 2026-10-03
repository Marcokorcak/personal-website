import { chromium } from '@playwright/test';
import { checkPortfolio } from './portfolio-browser-checks.mjs';

const browser = await chromium.launch({
  ...(process.platform === 'darwin' ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } : {}),
  headless: true,
});
try {
  const page = await browser.newPage();
  await checkPortfolio(page, process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:5173/');
} finally {
  await browser.close();
}
