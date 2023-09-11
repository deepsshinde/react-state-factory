import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'react-state-factory',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // ensure that external packages are not bundled
      external: ['react', 'use-saga-reducer', 'redux-saga'],
      output: {
        globals: {
          react: 'React',
          'use-saga-reducer': 'useSagaReducer',
          'redux-saga/effects': 'put'
        }
      }
    }
  },
  plugins: [dts()],
});
