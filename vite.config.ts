import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      // story 與測試不是套件的公開介面，不要產生對應的型別檔
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.ts'],
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LeaveDesignSystem',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'leave-ds.[ext]',
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
});
