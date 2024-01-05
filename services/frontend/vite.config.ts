import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from '@unocss/svelte-scoped/vite'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { wasm } from '@rollup/plugin-wasm'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  plugins: [
    nodePolyfills(),
    viteStaticCopy({
      targets: [{
        src: 'node_modules/@matrix-org/olm/olm.wasm',
        dest: '',
      }],
    }),
    wasm(),
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css',
    }),
    sveltekit(),
  ],
  server: {
    fs: {
      allow: ['locales'],
    },
  },
})
