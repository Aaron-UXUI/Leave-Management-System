import { defineConfig } from 'vitest/config';

/**
 * 單元測試只跑 src 底下的純邏輯。
 *
 * tests/ 底下是 Playwright 的視覺與無障礙測試，兩套執行器不能混跑，
 * 所以這裡明確限定範圍。
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
