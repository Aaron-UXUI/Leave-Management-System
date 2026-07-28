import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
    `找不到 ${indexPath}。請先執行 npm run build-storybook，無障礙檢查是跑在建置後的 Storybook 上。`
  );
}

/**
 * 檢查的標準。
 *
 * 研究頁明訂系統須達 WCAG AA，且使用者年齡跨 20–60 歲以上，
 * 因此取 wcag2a + wcag2aa + wcag21a + wcag21aa 這組規則。
 */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * 不檢查的 story。
 *
 * Foundations 的 token 展示頁是文件性質的色票與字級樣本，
 * 不是產品介面 —— 例如色票卡片本來就是純色塊，
 * 用介面的對比規則去檢查它沒有意義。
 */
const SKIP = new Set<string>([
  'foundations-tokens--colors',
  'foundations-tokens--typography',
  'foundations-tokens--spacing',
  'foundations-tokens--radius-and-elevation',
]);

const stories = Object.values(index.entries)
  .filter((entry) => entry.type === 'story' && !SKIP.has(entry.id))
  .sort((a, b) => a.id.localeCompare(b.id));

test.describe('無障礙', () => {
  for (const story of stories) {
    test(`${story.title} / ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForSelector('#storybook-root', { state: 'attached' });
      await page.evaluate(() => document.fonts.ready);

      // 等版面完全穩定再檢查。少了這一步，axe 會在元素還沒套完樣式時
      // 就去算對比度，導致同一份程式碼每次跑出不同的違規清單。
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

      // 失敗時把違規內容印出來，CI log 就能直接看到是哪一條規則、哪個元素
      if (results.violations.length > 0) {
        const detail = results.violations
          .map(
            (v) =>
              `  [${v.impact}] ${v.id}: ${v.help}\n` +
              v.nodes.map((n) => `      ${n.target.join(' ')}`).join('\n')
          )
          .join('\n');
        console.error(`\n${story.title} / ${story.name}\n${detail}\n`);
      }

      expect(results.violations).toEqual([]);
    });
  }
});
