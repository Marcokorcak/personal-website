import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';
import { checkPortfolio } from './portfolio-browser-checks.mjs';

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
  const url = "http://127.0.0.1:" + server.address().port + basePath + "/";
  await checkPortfolio(page, url);
  assert.equal(await page.evaluate(() => document.fonts.check('16px Manrope')), true);
  assert.equal(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily.includes('Manrope')), true);
  assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), 'https://marcokorcak.github.io/personal-website/images/social-preview.png');
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://marcokorcak.github.io/personal-website/');
  const socialResponse = await page.request.get(new URL('images/social-preview.png', url).href);
  assert.equal(socialResponse.status(), 200);
  assert.equal(socialResponse.headers()['content-type'], 'image/png');
  const png = await socialResponse.body();
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  for (const filename of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
    assert.equal((await page.request.get(new URL(filename, url).href)).status(), 200);
  }
  console.log('GitHub Pages export passed: real subpath hosting, assets, metadata, social image and icons.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
