import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

export async function checkPortfolio(page, url) {
  const destination = '.sites-runtime/qa';
  await mkdir(destination, { recursive: true });
  const failures = [];
  const cancellations = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', request => {
    const reason = request.failure()?.errorText;
    // Navigating or changing srcset may cancel a pending request. Preserve
    // this evidence separately; image decoding and HTTP checks catch failures.
    if (reason === 'net::ERR_ABORTED') cancellations.push(request.url());
    else failures.push(reason + ' ' + request.url());
  });
  page.on('response', response => { if (response.status() >= 400) failures.push(response.status() + ' ' + response.url()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.equal((await page.goto(url, { waitUntil: 'networkidle' })).status(), 200);
  await page.locator('.header-brand .brand-mark-editorial').waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.deepEqual(await page.locator('main > section').evaluateAll(sections => sections.map(s => s.id)), ['home', 'work', 'experience', 'approach', 'stack', 'contact']);
  assert.equal(await page.locator('.work-story').count(), 4);
  assert.equal(await page.locator('.featured-story').count(), 2);
  assert.equal(await page.getByRole('term').filter({ hasText: 'My role' }).count(), 4);
  assert.equal(await page.getByRole('term').filter({ hasText: 'Outcome' }).count(), 4);
  assert.equal(await page.locator('a[download]').count(), 0);
  assert.equal((await page.request.get(new URL('Marco-Korcak-Resume.pdf', url).href)).status(), 404);
  assert.equal(await page.locator('.current-role h3').textContent(), 'Software Engineer');
  assert.equal(await page.getByText('Louisiana State University Shreveport', { exact: true }).count(), 1);
  assert.equal(await page.getByText('July 2026 — Present', { exact: true }).count(), 1);
  assert.equal(await page.locator('.workflow-figure figcaption').count(), 2);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => element.decode());
    assert(await image.evaluate(element => element.naturalWidth > 0));
  }

  // Independent disclosures support comparing contributions without modal focus.
  for (const index of [0, 2, 1, 3]) {
    const details = page.locator('#contribution-' + index + ' details');
    const summary = details.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    assert(await details.evaluate(element => element.open));
    assert(await details.locator('.contribution-details h4').count() >= 4);
    assert(await summary.evaluate(element => document.activeElement === element));
    await page.keyboard.press('Enter');
    assert.equal(await details.evaluate(element => element.open), false);
    const height = await summary.evaluate(element => element.getBoundingClientRect().height);
    assert(height >= 44, 'Contribution touch target too small');
  }
  await page.locator('#contribution-0 summary').click();
  await page.locator('#contribution-2 summary').click();
  assert.equal(await page.locator('details[open]').count(), 2);
  await page.locator('#contribution-0 summary').click();
  await page.locator('#contribution-2 summary').click();

  // Side-by-side features must retain an explicit choice; serial rows follow
  // reading position in both directions, including after viewport changes.
  const workNavigation = page.getByRole('navigation', { name: 'Contribution index' });
  await workNavigation.getByRole('link', { name: 'Reliable engagement analytics' }).click();
  await page.waitForTimeout(650);
  assert.equal(await workNavigation.locator('[aria-current]').getAttribute('href'), '#contribution-2');
  await page.evaluate(() => {
    document.activeElement?.blur();
    document.documentElement.style.scrollBehavior = 'auto';
  });
  for (const index of [1, 3, 1, 0]) {
    await page.locator('#contribution-' + index).evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 125));
    await page.waitForTimeout(100);
    const expected = index === 0 ? 2 : index;
    assert.equal(await workNavigation.locator('[aria-current]').getAttribute('href'), '#contribution-' + expected);
  }
  await workNavigation.getByRole('link', { name: 'Enterprise AI workflows' }).click();
  assert.equal(await workNavigation.locator('[aria-current]').getAttribute('href'), '#contribution-0');
  await page.setViewportSize({ width: 1440, height: 768 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(650);
  const action = await page.getByRole('link', { name: 'Explore my work' }).boundingBox();
  assert(action && action.y + action.height < 768, 'Primary action below laptop viewport');
  await page.screenshot({ path: destination + '/desktop-hero.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const id of ['work', 'experience', 'approach', 'stack', 'contact']) {
    await page.locator('#' + id).evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 100));
    await page.waitForTimeout(150);
    await page.screenshot({ path: destination + '/desktop-' + id + '.png' });
  }

  for (const width of [1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(650);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow at ' + width);
    if (width === 390) {
      const mobileAction = await page.getByRole('link', { name: 'Explore my work' }).boundingBox();
      assert(mobileAction && mobileAction.y + mobileAction.height < 844, 'Mobile primary action obscured');
      const positions = await page.evaluate(() => ({
        employment: document.querySelector('.current-role').getBoundingClientRect().top,
        education: document.querySelector('.education-list').getBoundingClientRect().top,
      }));
      assert(positions.employment < positions.education, 'Education precedes current role on mobile');
      assert(await workNavigation.isVisible(), 'Contribution index missing on mobile');
      await page.screenshot({ path: destination + '/mobile-hero.png' });
      await page.getByRole('button', { name: 'Open navigation' }).click();
      const menu = page.getByRole('dialog');
      await menu.waitFor();
      assert(await menu.getByRole('button', { name: 'Close', exact: true }).evaluate(element => element.getBoundingClientRect().width >= 44));
      await menu.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
      await menu.waitFor({ state: 'hidden' });
      await page.waitForTimeout(650);
      assert.equal(new URL(page.url()).hash, '#work');
      assert(await page.locator('#work').evaluate(element => element.getBoundingClientRect().top >= 70));
      await page.screenshot({ path: destination + '/mobile-work.png' });
      await page.locator('#contribution-0 summary').click();
      assert(await page.locator('#contribution-0 details').evaluate(element => element.open));
      await page.screenshot({ path: destination + '/mobile-details.png' });
      await page.locator('#contribution-0 summary').click();
      await page.evaluate(() => { document.activeElement?.blur(); document.documentElement.style.scrollBehavior = 'auto'; });
      let capturedAnalytics = false;
      for (const index of [0, 2, 1, 3, 1, 2, 0]) {
        await page.locator('#contribution-' + index).evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 110));
        await page.waitForTimeout(100);
        assert.equal(await workNavigation.locator('[aria-current]').getAttribute('href'), '#contribution-' + index);
        if (index === 2 && !capturedAnalytics) {
          await page.locator('#contribution-2').screenshot({ path: destination + '/mobile-analytics.png' });
          capturedAnalytics = true;
        }
      }
    }
  }

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.contact-link').first().getAttribute('href'), 'mailto:Marcokorcak02@gmail.com');
  assert.equal(await page.locator('.linkedin-link').getAttribute('href'), 'https://www.linkedin.com/in/marco-korcak/');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await page.getByRole('status').filter({ hasText: 'Email copied' }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'Marcokorcak02@gmail.com');
  const beforeCopyFailure = page.url();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard denied'); } } }));
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await page.getByRole('status').filter({ hasText: 'Couldn’t copy' }).waitFor();
  assert.equal(page.url(), beforeCopyFailure, 'Copy failure unexpectedly launches another app');
  assert(await page.locator('.back-top').evaluate(element => element.getBoundingClientRect().height >= 44));

  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.equal(await page.locator('.hero-statement').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.equal(await page.locator('.hero-image').evaluate(element => getComputedStyle(element).transform), 'none');
    await page.evaluate(() => document.documentElement.style.fontSize = '32px');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Overflow at 200% text / ' + width);
    assert(await page.locator('.skip-link').evaluate(element => element.getBoundingClientRect().bottom < 0), 'Unfocused skip link visible');
    const clipped = await page.locator('.work-story, .decision-band, .capability-row, .principle-ledger').evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().right > innerWidth + 1).length);
    assert.equal(clipped, 0, 'Enlarged content clipped');
    await page.locator('.skip-link').focus();
    await page.waitForFunction(() => document.querySelector('.skip-link').getBoundingClientRect().top >= 0);
    assert(await page.locator('.skip-link').evaluate(element => element.getBoundingClientRect().top >= 0));
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#work');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'work');
    if (width === 320) await page.screenshot({ path: destination + '/enlarged-text.png' });
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(new URL('brand-study/', url).href, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.brand-option').count(), 8);
  await page.getByRole('link', { name: 'Preview in the header' }).nth(1).click();
  await page.locator('.header-brand .brand-mark-architectural').waitFor();
  assert.equal(new URL(page.url()).pathname, new URL(url).pathname);
  assert.deepEqual(failures, []);
  await writeFile(destination + '/results.json', JSON.stringify({ passed: ['work-first order', 'four contributions with ownership and outcomes', 'keyboard and independent inline disclosures', 'reading index and explicit selection', 'mobile menu and contact', 'clipboard success and failure', '320–1440px containment', '200% text and skip link', 'reduced motion', 'brand previews'], failures, cancellations }, null, 2));
  console.log('Portfolio interactions passed: work-first structure, disclosures, navigation, contact, enlarged text, reduced motion and branding.');
}
