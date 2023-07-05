import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { wasm } from '@rollup/plugin-wasm'

export default defineConfig({
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis',
			},
		}
	},
	plugins: [
		viteStaticCopy({
			targets: [{
				src: 'node_modules/@matrix-org/olm/olm.wasm',
				dest: ''
			}]
		}),
		wasm(),
		UnoCSS(),
		sveltekit(),
	]
});
