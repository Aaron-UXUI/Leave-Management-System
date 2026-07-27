#!/usr/bin/env node
/**
 * src/icons/svg/*.svg  ->  src/icons/icons.generated.ts
 *
 * 讀取已合成的 SVG，抽出 viewBox、stroke-width 與 path 群組，
 * 產生給 <Icon> 元件使用的登錄表。不需連網，可離線重跑。
 *
 * 用法：node scripts/build-icon-components.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const SVG_DIR = resolve(root, 'src/icons/svg');
const OUT = resolve(root, 'src/icons/icons.generated.ts');

const files = readdirSync(SVG_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort();

const icons = files.map((file) => {
  const svg = readFileSync(join(SVG_DIR, file), 'utf8');
  const name = file.replace(/\.svg$/, '');

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  const mode = svg.includes('fill="currentColor"') ? 'fill' : 'stroke';
  // 填色圖示沒有描邊，以 0 表示
  const strokeWidth = mode === 'fill' ? '0' : svg.match(/stroke-width="([^"]+)"/)?.[1];
  const figmaName = svg.match(/Figma 元件：(.+?)（node ([\d:]+)）/);

  if (!viewBox || !strokeWidth) throw new Error(`${file} 缺少 viewBox 或 stroke-width`);

  // 取出 <svg> 內部所有 <g>…</g>，作為元件的 children
  const body = svg
    .slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('');

  return {
    name,
    viewBox,
    strokeWidth,
    mode,
    size: Number(viewBox.split(' ')[2]),
    body,
    figmaName: figmaName?.[1] ?? '',
    nodeId: figmaName?.[2] ?? '',
  };
});

const entries = icons
  .map(
    (i) => `  '${i.name}': {
    viewBox: '${i.viewBox}',
    strokeWidth: ${i.strokeWidth},
    mode: '${i.mode}',
    size: ${i.size},
    figma: { name: ${JSON.stringify(i.figmaName)}, nodeId: '${i.nodeId}' },
    body: ${JSON.stringify(i.body)},
  },`
  )
  .join('\n');

const ts = `/**
 * 自動產生檔案 —— 請勿手動編輯。
 *
 * 來源：src/icons/svg/*.svg（由 scripts/build-icons.mjs 從 Figma 合成）
 * 產生：node scripts/build-icon-components.mjs
 */

export interface IconDefinition {
  /** SVG viewBox，同時決定圖示的原生尺寸 */
  viewBox: string;
  /** Figma 中的描邊寬度（viewBox 單位，會隨顯示尺寸等比縮放）；填色圖示為 0 */
  strokeWidth: number;
  /** 上色方式：描邊（Lucide 系列）或填色（Search Bar 的放大鏡） */
  mode: 'stroke' | 'fill';
  /** 原生尺寸（px）—— 未指定 size 時的預設值 */
  size: number;
  /** 對應的 Figma 元件，方便追溯來源 */
  figma: { name: string; nodeId: string };
  /** SVG 內容 */
  body: string;
}

export const icons = {
${entries}
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];
`;

writeFileSync(OUT, ts, 'utf8');
console.log(`✓ ${icons.length} 個圖示 → icons.generated.ts（${icons.map((i) => i.name).join(', ')}）`);
