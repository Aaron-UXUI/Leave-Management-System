import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

interface StorybookIndex {
  entries: Record<string, { id: string; title: string; name: string; type: string }>;
}

const here = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(here, '../storybook-static/index.json');

let index: StorybookIndex;
try {
  index = JSON.parse(readFileSync(indexPath, 'utf8')) as StorybookIndex;
} catch {
  throw new Error(
    `找不到 ${indexPath}。請先執行 npm run build-storybook，視覺回歸測試是跑在建置後的 Storybook 上。`
  );
}

/**
 * 本質上不穩定、不適合做視覺比對的 story。
 *
 * 這些 story 會隨時間自己改變畫面，截圖時機不同就會得到不同結果，
 * 納入比對只會製造假警報。它們的視覺已由同元件的靜態 story 涵蓋。
 */
const SKIP = new Set<string>([
  // 上傳進度會用 setInterval 自己往前跑
  'components-button--secondary-upload-flow',
]);

const stories = Object.values(index.entries)
  .filter((entry) => entry.type === 'story' && !SKIP.has(entry.id))
  .sort((a, b) => a.id.localeCompare(b.id));

test.describe('視覺回歸', () => {
  for (const story of stories) {
    test(`${story.title} / ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

      // 等 Storybook 掛載完成
      await page.waitForSelector('#storybook-root', { state: 'attached' });

      // 等字體載入，否則會先用後備字體截到圖
      await page.evaluate(() => document.fonts.ready);

      // 等版面穩定下來
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`${story.id}.png`, { fullPage: true });
    });
  }
});
