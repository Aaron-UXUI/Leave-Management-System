import type { Preview } from '@storybook/react-vite';

// 設計稿指定的字體。用本地套件而非 CDN，讓視覺回歸測試的渲染結果穩定。
import '@fontsource/noto-sans-tc/400.css';
import '@fontsource/noto-sans-tc/500.css';
import '@fontsource/noto-sans-tc/700.css';

import '../src/tokens/tokens.css';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Introduction', 'Colors', 'Typography', 'Spacing', 'Radius', 'Elevation', 'Icons'],
          'Components',
          ['Button', 'Form', 'Feedback', 'Navigation', 'Overlay'],
        ],
      },
    },
    backgrounds: {
      options: {
        surface: { name: 'Surface (Grey Scale/White)', value: '#fafafa' },
        page: { name: 'Page (#ffffff)', value: '#ffffff' },
      },
    },
    a11y: { test: 'todo' },
  },
  initialGlobals: {
    backgrounds: { value: 'page' },
  },
};

export default preview;
