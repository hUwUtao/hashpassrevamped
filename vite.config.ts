import { defineConfig } from "vite";
import UnoCSS from 'unocss/vite'
import preact from '@preact/preset-vite';

export default defineConfig({
	plugins: [
		UnoCSS(),
		// preact()
	],
	worker: {
		format: "es"
	},
	build: {
		outDir: "dist",
		sourcemap: true,
	},
	resolve: {
		alias: {
			"react": "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",     // Must be below test-utils
			"react/jsx-runtime": "preact/jsx-runtime"
		},
	},
});
