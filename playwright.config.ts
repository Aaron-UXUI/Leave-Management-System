import { defineConfig, devices } from '@playwright/test';

/**
 * 視覺回歸測試設定。
 *
 * 對已建置的 Storybook（storybook-static）逐一截圖，與 committed 的基準畫面比對。
 * 目的是抓住「改了共用樣式，卻不小心波及其他元件」這類問題 ——
 * token 稽核與型別檢查都看不出來的那種。
 *
 * 基準畫面一律由 CI（Linux）產生，因為字體渲染會因作業系統而異。
 * 更新方式見 docs/visual-testing.md。
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',

  // 基準畫面依作業系統分開存放，避免 macOS 與 Linux 的字體渲染互相打架
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',

  expect: {
    toHaveScreenshot: {
      /*
       * 用絕對像素數，不用比例。
       *
       * 比例門檻在整頁截圖上形同虛設：1280×800 的 1% 是一萬多個像素，
       * 而「按鈕圓角被改掉」這種真正該擋下的變動只影響幾百個像素，
       * 會被直接放過（這是實測出來的，不是理論推測）。
       *
       * 基準畫面與比對都在同一個平台、同一版瀏覽器上跑，
       * 所以反鋸齒雜訊本來就趨近於零，門檻可以壓得很低。
       */
      maxDiffPixels: 50,
      animations: 'disabled',
    },
  },

  use: {
    baseURL: 'http://127.0.0.1:6007',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        // 讓 prefers-reduced-motion 生效，關掉元件自己的入場動畫
        contextOptions: { reducedMotion: 'reduce' },
      },
    },
  ],

  webServer: {
    command: 'npx http-server storybook-static -p 6007 --silent',
    url: 'http://127.0.0.1:6007/index.json',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
