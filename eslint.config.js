import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  {
    ignores: ['dist', 'storybook-static', 'node_modules'],
  },

  // 元件與 token 原始碼
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // 這是中文專案，全形空格（U+3000）在文案中是合法排版用法
      'no-irregular-whitespace': ['error', { skipJSXText: true }],

      // 產生出來的檔案不該被人手改，也不需要被規則挑剔
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // 未使用的變數以底線開頭表示刻意忽略
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Storybook stories
  {
    files: ['src/**/*.stories.{ts,tsx}'],
    extends: [...storybook.configs['flat/recommended']],
  },

  // 建置腳本跑在 Node 上，不是瀏覽器
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },

  // 自動產生的檔案不納入檢查
  {
    ignores: ['src/tokens/tokens.ts', 'src/tokens/tokens.css', 'src/icons/icons.generated.ts'],
  }
);
