#!/usr/bin/env node
/**
 * Token 稽核 —— 確保 Figma 是唯一真實來源。
 *
 * 檢查兩件事：
 *   1. 元件 CSS 不得出現寫死的色碼、字級、間距、圓角、陰影。
 *      任何視覺數值都必須透過 var(--lds-*) 引用。
 *   2. 元件 CSS 引用的每一個 --lds-* 變數，都必須真的存在於 tokens.css。
 *      （抓拼錯的變數名，這種錯在瀏覽器裡是靜默失效的）
 *
 * 用法：npm run tokens:check
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const TOKENS_CSS = resolve(root, 'src/tokens/tokens.css');
const SCAN_DIRS = [resolve(root, 'src/components'), resolve(root, 'src/styles')];

/** 允許寫死的數值：0、1px 邊框、百分比、透明、繼承等排版必需品。 */
const ALLOWED_LITERALS = new Set(['0', '0px', '1px', '2px', '3px', '100%', 'auto', 'none']);

const RULES = [
  {
    id: 'hardcoded-color',
    // #abc / #aabbcc / rgb() / rgba()
    re: /(?<![\w-])(#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\))/g,
    message: '寫死色碼，請改用 var(--lds-color-*)',
  },
  {
    id: 'hardcoded-font-size',
    re: /\bfont-size\s*:\s*([^;]+);/g,
    message: 'font-size 請改用 var(--lds-font-size-*) 或 var(--lds-typography-*-font-size)',
  },
  {
    id: 'hardcoded-radius',
    re: /\bborder-radius\s*:\s*([^;]+);/g,
    message: 'border-radius 請改用 var(--lds-radius-*)',
  },
  {
    id: 'hardcoded-shadow',
    re: /\bbox-shadow\s*:\s*([^;]+);/g,
    message: 'box-shadow 請改用 var(--lds-elevation-*)',
  },
  {
    id: 'hardcoded-spacing',
    // padding / margin / gap 及其邏輯屬性寫法
    re: /\b((?:padding|margin)(?:-(?:block|inline|top|right|bottom|left))?(?:-(?:start|end))?|(?:row-|column-)?gap)\s*:\s*([^;]+);/g,
    valueGroup: 2,
    message: '間距請改用 var(--lds-spacing-*)',
  },
];

/**
 * 屬性值裡是否還有「沒走 token」的長度值。
 *
 * 不能只判斷「整段有沒有出現 var(--lds-」—— padding: var(--lds-spacing-xs) 11px
 * 這種混用會被放過。做法是先把所有 var(...) 拿掉，再看剩下什麼。
 */
const hasBareLength = (value) => {
  const stripped = value
    // token 參照
    .replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ' ')
    // 瀏覽器提供的安全區，由裝置決定而非設計決定
    .replace(/env\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ' ');
  return /(?<![\w.-])\d*\.?\d+(px|rem|em|%|ch|vh|vw)\b/.test(stripped);
};

/** 標了 non-token 的行（或其上一行）可豁免，用於設計稿本身就沒使用 token 的情況。 */
const isExempt = (lines, lineNo) => {
  const current = lines[lineNo - 1] ?? '';
  const previous = lines[lineNo - 2] ?? '';
  return /non-token/.test(current) || /non-token/.test(previous);
};

const walkCss = (dir) => {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(walkCss(full));
    else if (name.endsWith('.css')) out.push(full);
  }
  return out;
};

const tokensCss = readFileSync(TOKENS_CSS, 'utf8');
const definedVars = new Set([...tokensCss.matchAll(/^\s*(--lds-[\w-]+)\s*:/gm)].map((m) => m[1]));

const files = SCAN_DIRS.flatMap(walkCss);
const problems = [];

const lineOf = (src, index) => src.slice(0, index).split('\n').length;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  // 去掉註解，避免說明文字被誤判
  const code = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const rel = relative(root, file);

  const srcLines = src.split('\n');

  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(code)) !== null) {
      const captured = (m[rule.valueGroup ?? 1] ?? m[0]).trim();
      const line = lineOf(code, m.index);

      if (rule.id === 'hardcoded-spacing') {
        // 混用 var() 與裸數值也要抓，所以另外判斷
        if (!hasBareLength(captured)) continue;
        if (isExempt(srcLines, line)) continue;
      } else {
        if (captured.includes('var(--lds-')) continue;
        if (ALLOWED_LITERALS.has(captured)) continue;
        // 允許 "1px solid var(--lds-color-...)" 這類複合值中的非數值關鍵字
        if (rule.id !== 'hardcoded-color' && !/[0-9#]/.test(captured)) continue;
      }

      problems.push({
        file: rel,
        line,
        rule: rule.id,
        found: captured,
        message: rule.message,
      });
    }
  }

  for (const m of code.matchAll(/var\(\s*(--lds-[\w-]+)/g)) {
    if (!definedVars.has(m[1])) {
      problems.push({
        file: rel,
        line: lineOf(code, m.index),
        rule: 'unknown-token',
        found: m[1],
        message: 'tokens.css 沒有這個變數，可能是拼錯或 Figma 尚未同步',
      });
    }
  }
}

if (problems.length === 0) {
  console.log(`✓ 稽核通過：${files.length} 個 CSS 檔，全部視覺數值皆來自 Figma token`);
  process.exit(0);
}

console.error(`✗ 發現 ${problems.length} 個問題：\n`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}  [${p.rule}]  ${p.found}`);
  console.error(`    → ${p.message}\n`);
}
process.exit(1);
