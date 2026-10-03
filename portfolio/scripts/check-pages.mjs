import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';

// Serve the actual export beneath the same mount point as GitHub project Pages.
// A fallback to index.html would conceal missing assets, so return real 404s.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/personal-website';
const directory = resolve('out');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.txt': 'text/plain' };
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
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
    assert.equal(await image.evaluate(element => element.naturalWidth > 0), true);
  }
  await page.locator('.detail-button').first().click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal((await page.goto(`${url}brand-study/`, { waitUntil: 'networkidle' })).status(), 200);
  assert.equal(await page.locator('.brand-option').count(), 8);
  await page.getByRole('link', { name: 'Preview in the header' }).nth(1).click();
  await page.locator('.header-brand .brand-mark-architectural').waitFor();
  assert.equal(new URL(page.url()).pathname, `${basePath}/`);
  assert.deepEqual(failures, []);
  console.log('Pages export passed: homepage, JS/CSS/fonts/images, interactive dialogs, logo gallery, and return links.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
