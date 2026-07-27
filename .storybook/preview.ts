import type { Preview } from '@storybook/react-vite';

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
