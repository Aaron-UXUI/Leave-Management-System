#!/usr/bin/env node
/**
 * Figma 圖示 -> src/icons/svg/*.svg
 *
 * Figma 把每個圖示的每一筆 stroke 各自匯出成一個 SVG，且座標是各自的區域座標系。
 * 本腳本依照 Figma 回報的節點位置，把這些碎片平移回 24x24 / 16x16 的圖示座標系，
 * 合成單一 SVG，並把 stroke 改成 currentColor，讓顏色可由 CSS 控制。
 *
 * 注意：Figma 的資產 URL 只有 7 天效期。產生出來的 SVG 會 commit 進 repo，
 * 平常不需要重跑；只有當 Figma 圖示改版時，才重新取得 URL 並執行本腳本。
 *
 * 用法：node scripts/build-icons.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const OUT_DIR = resolve(root, 'src/icons/svg');

/**
 * translate = 該筆 stroke 在圖示座標系中的 bbox 原點 − 0.55
 * （0.55 是 Figma 匯出時為容納 1.1 描邊而外擴的半個描邊寬）
 */
const ICONS = [
  {
    name: 'user',
    figmaName: 'icon 24 / user',
    nodeId: '1286:16953',
    size: 24,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/f7e3c4e7-4770-42cc-8594-84d5460fc83a', tx: 4.45, ty: 14.45 },
      { url: 'https://www.figma.com/api/mcp/asset/a167cecb-d601-4b77-9db6-d71ca70cf5cd', tx: 7.45, ty: 2.45 },
    ],
  },
  {
    name: 'chevron-down',
    figmaName: 'icon 24 / chevron',
    nodeId: '1125:9160',
    size: 24,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/92ca142a-a876-452f-9b1b-e00198bf25b3', tx: 3.45, ty: 7.45 },
    ],
  },
  {
    name: 'calendar',
    figmaName: 'icon 24 / calendar',
    nodeId: '1141:24277',
    size: 24,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/3d183f1c-5c76-4fd7-a2ae-3c5bdcb2a04f', tx: 2.45, ty: 1.45 },
    ],
  },
  {
    name: 'info',
    figmaName: 'icon 24 / info',
    nodeId: '1433:33207',
    size: 24,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/048ee0f1-646c-4f83-9fbe-87024204c29b', tx: 1.45, ty: 1.45 },
      { url: 'https://www.figma.com/api/mcp/asset/f50b3afb-33f9-4cf3-ac1a-fec1bf21b7aa', tx: 11.45, ty: 8.95 },
      { url: 'https://www.figma.com/api/mcp/asset/b6d95235-37b5-452d-bc8e-e5be4a9866dd', tx: 11.45, ty: 5.95 },
    ],
  },
  {
    name: 'upload',
    figmaName: 'icon 24/ upload',
    nodeId: '1190:30684',
    size: 24,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/7c041779-8a68-4776-a833-b595d70419d3', tx: 2.45, ty: 2.45 },
    ],
  },
  {
    name: 'upload-16',
    figmaName: 'icon 16 / upload',
    nodeId: '1286:5890',
    size: 16,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/fd25163a-b16b-47a5-bc30-4926d56e9f4a', tx: 7.45, ty: 1.45 },
      { url: 'https://www.figma.com/api/mcp/asset/07dcbc85-56ab-42bf-a488-4d86980e3361', tx: 4.117, ty: 1.45 },
      { url: 'https://www.figma.com/api/mcp/asset/6681d682-6731-4251-b960-74d8d33c9d9e', tx: 1.45, ty: 9.45 },
    ],
  },
  {
    name: 'sort-16',
    figmaName: 'icon 16/ sort',
    nodeId: '1975:7312',
    size: 16,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/6d49dc86-3c35-4c89-8d0a-d2fc3e20dc1d', tx: 8.117, ty: 10.117 },
      { url: 'https://www.figma.com/api/mcp/asset/4e9a629c-5cfb-4a14-a876-721d8f83c410', tx: 10.783, ty: 2.117 },
      { url: 'https://www.figma.com/api/mcp/asset/592abd86-6d25-4de5-a1e0-2f9fac99431d', tx: 1.45, ty: 2.117 },
      { url: 'https://www.figma.com/api/mcp/asset/a913d31f-8a8a-4c9f-b6ef-d989d5664359', tx: 4.117, ty: 2.117 },
    ],
  },
  {
    name: 'filter-16',
    figmaName: 'icon 16/ filter',
    nodeId: '1975:8179',
    size: 16,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/cd92c453-a00a-46ad-b813-5606dbc52b50', tx: 0.783, ty: 2.783 },
      { url: 'https://www.figma.com/api/mcp/asset/3e6f4b89-c0fb-416e-9374-72c542e60853', tx: 3.45, ty: 7.45 },
      { url: 'https://www.figma.com/api/mcp/asset/2df9fa35-baac-4810-b05a-4f67e07bacb0', tx: 5.45, ty: 12.117 },
    ],
  },
  // 以下兩個圖示並未收錄在 Figma 的 icon section，而是內嵌在元件裡。
  // 為了讓 Checkbox 與 Search Bar 也能走同一套圖示管線，一併抽出。
  {
    name: 'check-20',
    figmaName: 'CheckBox / Checked?=Yes 內的勾號',
    nodeId: '1190:29728',
    size: 20,
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/8cfb6880-f5b1-450d-8bb2-ebbb09e16d03', tx: 2.783, ty: 4.45 },
    ],
  },
  {
    name: 'search-20',
    figmaName: 'Search Bar 內的 icon / 20px（填色風格，非 Lucide）',
    nodeId: '2484:3995',
    size: 20,
    mode: 'fill',
    parts: [
      { url: 'https://www.figma.com/api/mcp/asset/ffd03e2b-7a5d-4417-abdd-78897fa2ecc7', tx: 1, ty: 1 },
    ],
  },
];

/** 從 Figma 匯出的單筆 SVG 中取出 d 屬性。 */
const extractPathData = (svg, url) => {
  const d = svg.match(/\sd="([^"]+)"/);
  if (!d) throw new Error(`資產沒有可用的 path：${url}`);
  const strokeWidth = svg.match(/stroke-width="([^"]+)"/)?.[1] ?? '1.1';
  return { d: d[1], strokeWidth };
};

const round = (n) => Number(n.toFixed(3));

mkdirSync(OUT_DIR, { recursive: true });

const built = [];

for (const icon of ICONS) {
  const groups = [];
  let strokeWidth = '1.1';

  for (const part of icon.parts) {
    const res = await fetch(part.url);
    if (!res.ok) {
      throw new Error(
        `下載失敗 ${res.status}：${part.url}\n` +
          'Figma 資產 URL 只有 7 天效期，請重新執行 get_design_context 取得新的 URL。'
      );
    }
    const parsed = extractPathData(await res.text(), part.url);
    strokeWidth = parsed.strokeWidth;
    groups.push(
      `  <g transform="translate(${round(part.tx)} ${round(part.ty)})">\n` +
        `    <path d="${parsed.d}" />\n` +
        `  </g>`
    );
  }

  // 填色圖示不需要描邊屬性，改由 fill 繼承 currentColor
  const rootAttrs =
    icon.mode === 'fill'
      ? `     fill="currentColor" stroke="none">`
      : `     fill="none" stroke="currentColor" stroke-width="${strokeWidth}"\n` +
        `     stroke-linecap="round" stroke-linejoin="round">`;

  const svg =
    `<!-- 由 scripts/build-icons.mjs 從 Figma 產生，請勿手改。\n` +
    `     Figma 元件：${icon.figmaName}（node ${icon.nodeId}） -->\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.size} ${icon.size}"\n` +
    rootAttrs +
    `\n` +
    groups.join('\n') +
    `\n</svg>\n`;

  writeFileSync(resolve(OUT_DIR, `${icon.name}.svg`), svg, 'utf8');
  built.push(`${icon.name} (${icon.parts.length} paths)`);
}

console.log(`✓ 產生 ${built.length} 個圖示：\n  ${built.join('\n  ')}`);
