import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			},
		}
	},
	plugins: [
		sveltekit(),
		UnoCSS()
	]
});
