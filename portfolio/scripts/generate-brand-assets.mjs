import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Render the existing brand, font, and artwork into static share/favicon assets.
// Commit these files; deployment never needs a browser to regenerate them.
const [font, artwork, mark] = await Promise.all([
  readFile('public/fonts/manrope-variable.ttf'),
  readFile('public/images/workstation.jpg'),
  readFile('public/favicon.svg'),
]);
const browser = await chromium.launch({
  ...(process.platform === 'darwin' ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } : {}),
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Manrope; src: url(data:font/ttf;base64,${font.toString('base64')}); font-weight: 200 800; }
    * { box-sizing: border-box; } body { margin: 0; font-family: Manrope, sans-serif; color: #f3f1e9; }
    .card { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #090e0c; }
    .art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
    .shade { position: absolute; inset: 0; background: linear-gradient(90deg,#080d0bf5 0%,#080d0be8 32%,#080d0ba3 57%,#080d0b15 100%),linear-gradient(0deg,#080d0bca,transparent 50%,#080d0b66); }
    .frame { position: absolute; inset: 18px; border: 1px solid #efe4ce30; border-radius: 12px; }
    .identity { position: absolute; top: 61px; left: 69px; display: flex; align-items: center; gap: 18px; }
    .identity img { width: 74px; height: 74px; } .identity span { font-size: 13px; letter-spacing: .18em; color: #d2cfc3; }
    .copy { position: absolute; top: 198px; left: 76px; }
    h1 { font-size: 73px; line-height: 1.1; letter-spacing: -.055em; font-weight: 550; margin: 0 0 25px; }
    p { margin: 0; font-size: 30px; line-height: 1.4; letter-spacing: -.025em; color: #dfe2d8; }
    p span { color: #f3ad76; }
    .footer { position: absolute; left: 76px; bottom: 61px; font-size: 13px; letter-spacing: .11em; color: #c2c6ba; }
    .footer::before { content: ''; display: inline-block; vertical-align: middle; width: 31px; height: 1px; background: #f3ad76; margin-right: 15px; }
  </style></head><body><div class="card">
    <img class="art" src="data:image/jpeg;base64,${artwork.toString('base64')}" alt="" />
    <div class="shade"></div><div class="frame"></div>
    <div class="identity"><img src="data:image/svg+xml;base64,${mark.toString('base64')}" alt="MK" /><span>SOFTWARE ENGINEER</span></div>
    <div class="copy"><h1>Marco Korcak</h1><p>Full-stack engineering.<br /><span>Applied AI.</span></p></div>
    <div class="footer">THOUGHTFUL SOFTWARE. REAL-WORLD IMPACT.</div>
  </div></body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  await page.screenshot({ path: 'public/images/social-preview.png' });
  for (const [size, filename] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png']]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<body style="margin:0;background:#0c1310"><img width="${size}" height="${size}" src="data:image/svg+xml;base64,${mark.toString('base64')}" /></body>`);
    await page.locator('img').evaluate(image => image.decode());
    await page.screenshot({ path: `public/${filename}` });
  }
  console.log('Generated social-preview.png (1200×630), favicon-32.png, and apple-touch-icon.png.');
} finally {
  await browser.close();
}
