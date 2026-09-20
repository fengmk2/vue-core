import { defineConfig } from 'vite-plus'
import Vue from '@vitejs/plugin-vue'
import * as CompilerSFC from 'vue/compiler-sfc'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  plugins: [
    Vue({
      compiler: CompilerSFC,
    }),
  ],
  build: {
    rolldownOptions: {
      input: {
        interop: resolve(import.meta.dirname, 'interop/index.html'),
        todomvc: resolve(import.meta.dirname, 'todomvc/index.html'),
        transition: resolve(import.meta.dirname, 'transition/index.html'),
        transitionGroup: resolve(
          import.meta.dirname,
          'transition-group/index.html',
        ),
      },
    },
  },
})
