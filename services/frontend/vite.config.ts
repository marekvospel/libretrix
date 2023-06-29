import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from 'unocss/vite'
import { transformerDirectives } from 'unocss'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit(),
		UnoCSS()
	]
});
