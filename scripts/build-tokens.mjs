#!/usr/bin/env node
/**
 * tokens.json  ->  src/tokens/tokens.css + src/tokens/tokens.ts
 *
 * tokens.json 是 Figma Variables 的鏡像，也是唯一可手改的 token 檔。
 * 本腳本產生的兩個檔案請勿手動編輯 —— 改 Figma、同步 tokens.json、再跑一次即可。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const SRC = resolve(root, 'src/tokens/tokens.json');
const OUT_CSS = resolve(root, 'src/tokens/tokens.css');
const OUT_TS = resolve(root, 'src/tokens/tokens.ts');

const PREFIX = 'lds';
const tokens = JSON.parse(readFileSync(SRC, 'utf8'));

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();

const cssVar = (path) => `--${PREFIX}-${path.map(kebab).join('-')}`;

/** 把 typography 的 composite 值攤成 CSS `font` 簡寫。 */
const fontShorthand = (v) =>
  `${v.fontWeight} ${v.fontSize}/${v.lineHeight} var(--${PREFIX}-font-family-sans)`;

/** @type {{ name: string, value: string, figma: string, group: string }[]} */
const flat = [];

const walk = (node, path) => {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || key.startsWith('_')) continue;
    if (child === null || typeof child !== 'object') continue;

    const next = [...path, key];

    if ('$value' in child) {
      const figma = child.$extensions?.figma ?? '';
      const group = next[0];

      if (typeof child.$value === 'object') {
        // composite typography token
        const v = child.$value;
        flat.push({ name: cssVar(next), value: fontShorthand(v), figma, group });
        flat.push({ name: `${cssVar(next)}-font-size`, value: v.fontSize, figma, group });
        flat.push({ name: `${cssVar(next)}-line-height`, value: v.lineHeight, figma, group });
        flat.push({ name: `${cssVar(next)}-font-weight`, value: v.fontWeight, figma, group });
      } else {
        flat.push({ name: cssVar(next), value: String(child.$value), figma, group });
      }
      continue;
    }

    walk(child, next);
  }
};

walk(tokens, []);

/* ------------------------------- tokens.css ------------------------------- */

const groups = [...new Set(flat.map((t) => t.group))];
const GROUP_TITLE = {
  color: 'Color — Primary / Grey Scale / Semantic',
  spacing: 'Spacing',
  radius: 'Corner radius（Figma 群組名為 "coner radius"，此處正規化為 radius）',
  font: 'Font primitives — family / size / line-height / weight',
  typography: 'Typography styles（值為 CSS font 簡寫，可直接 font: var(--lds-typography-body-m)）',
  elevation: 'Elevation',
};

const pad = Math.max(...flat.map((t) => t.name.length));

let css = `/**
 * 自動產生檔案 —— 請勿手動編輯。
 *
 * 來源：src/tokens/tokens.json（Figma Variables 的鏡像）
 * 產生：npm run tokens:build
 *
 * Figma 檔案：${tokens._meta.fileName}
 * fileKey：${tokens._meta.fileKey}
 * 同步日期：${tokens._meta.syncedAt}
 */

:root {
`;

for (const group of groups) {
  css += `\n  /* ---- ${GROUP_TITLE[group] ?? group} ---- */\n`;
  for (const t of flat.filter((x) => x.group === group)) {
    const decl = `  ${t.name}:`.padEnd(pad + 5) + ` ${t.value};`;
    css += t.figma ? `${decl.padEnd(pad + 40)} /* ${t.figma} */\n` : `${decl}\n`;
  }
}

css += `}\n`;
writeFileSync(OUT_CSS, css, 'utf8');

/* -------------------------------- tokens.ts ------------------------------- */

const tsEntries = flat
  .map((t) => `  '${t.name.slice(`--${PREFIX}-`.length)}': 'var(${t.name})',`)
  .join('\n');

const rawEntries = flat.map((t) => `  '${t.name}': ${JSON.stringify(t.value)},`).join('\n');

const ts = `/**
 * 自動產生檔案 —— 請勿手動編輯。
 *
 * 來源：src/tokens/tokens.json（Figma Variables 的鏡像）
 * 產生：npm run tokens:build
 */

/** token 名稱 -> CSS var() 參照。在 JS 端組樣式時用這個，才不會寫死數值。 */
export const token = {
${tsEntries}
} as const;

/** token 名稱 -> 實際字面值。僅供文件展示、測試比對用，元件請勿直接引用。 */
export const rawToken = {
${rawEntries}
} as const;

export type TokenName = keyof typeof token;
export type CssVarName = keyof typeof rawToken;
`;

writeFileSync(OUT_TS, ts, 'utf8');

console.log(`✓ ${flat.length} tokens → tokens.css、tokens.ts`);
