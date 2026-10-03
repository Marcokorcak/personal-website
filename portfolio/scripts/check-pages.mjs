import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';

// Serve the actual export beneath the same mount point as GitHub project Pages.
// A fallback to index.html would conceal missing assets, so return real 404s.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/personal-website';
const directory = resolve('out');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.txt': 'text/plain' };
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (!pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404).end();
    return;
  }
  let file = resolve(directory, `.${pathname.slice(basePath.length)}`);
  if (!file.startsWith(`${directory}${sep}`) && file !== directory) {
    response.writeHead(404).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({
    ...(process.platform === 'darwin' ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } : {}),
    headless: true,
  });
  const page = await browser.newPage();
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => failures.push(`${request.failure()?.errorText} ${request.url()}`));
  const url = `http://127.0.0.1:${server.address().port}${basePath}/`;
  assert.equal((await page.goto(url, { waitUntil: 'networkidle' })).status(), 200);
  await page.locator('.header-brand .brand-mark-editorial').waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => document.fonts.check('16px Manrope')), true);
  assert.equal(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily.includes('Manrope')), true);
  assert.equal(await page.locator('.work-evidence').count(), 4);
  assert.equal(await page.getByRole('term').filter({ hasText: 'My role' }).count(), 4);
  assert.equal(await page.getByRole('term').filter({ hasText: 'Outcome' }).count(), 4);
  const socialUrl = await page.locator('meta[property="og:image"]').getAttribute('content');
  assert.equal(socialUrl, 'https://marcokorcak.github.io/personal-website/images/social-preview.png');
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://marcokorcak.github.io/personal-website/');
  const socialResponse = await page.request.get(new URL('images/social-preview.png', url).href);
  assert.equal(socialResponse.status(), 200);
  assert.equal(socialResponse.headers()['content-type'], 'image/png');
  const png = await socialResponse.body();
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  for (const filename of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
    assert.equal((await page.request.get(`${url}${filename}`)).status(), 200);
  }
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
    assert.equal(await image.evaluate(element => element.naturalWidth > 0), true);
  }
  // With two cards visible, the next card must not steal the current highlight.
  // Exercise forward/backward scrolling, direct index links, and viewport resize.
  await page.setViewportSize({ width: 1440, height: 1400 });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const index of [0, 1, 2, 3, 2, 1, 0]) {
    await page.locator(`#contribution-${index}`).evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 125));
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.work-navigation a[aria-current="location"]').getAttribute('href'), `#contribution-${index}`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('navigation', { name: 'Contribution index' }).getByRole('link', { name: '03 Customer-facing experiences' }).click();
  await page.waitForFunction(() => document.querySelector('.work-navigation a[aria-current="location"]')?.getAttribute('href') === '#contribution-2', undefined, { timeout: 3000 });
  assert.equal(await page.locator('.work-navigation a[aria-current="location"]').getAttribute('href'), '#contribution-2');
  await page.locator('.detail-button').first().click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await mkdir('.sites-runtime/qa', { recursive: true });
  await page.locator('#contribution-0').evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 125));
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.sites-runtime/qa/pages-contributions.png' });
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}px`);
    if (width === 390) {
      await page.screenshot({ path: '.sites-runtime/qa/pages-mobile-hero.png' });
      await page.locator('#contribution-0').scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await page.screenshot({ path: '.sites-runtime/qa/pages-mobile-contribution.png' });
    }
  }
  assert.equal((await page.goto(`${url}brand-study/`, { waitUntil: 'networkidle' })).status(), 200);
  assert.equal(await page.locator('.brand-option').count(), 8);
  await page.getByRole('link', { name: 'Preview in the header' }).nth(1).click();
  await page.locator('.header-brand .brand-mark-architectural').waitFor();
  assert.equal(new URL(page.url()).pathname, `${basePath}/`);
  assert.deepEqual(failures, []);
  console.log('Pages export passed: assets, ownership/outcomes, reading-position navigation in both directions, responsive layouts, dialogs, logo gallery, and social preview metadata/image/icons.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
