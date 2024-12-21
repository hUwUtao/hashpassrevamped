import { defineConfig } from "vite";
// import preact from '@preact/preset-vite';

export default defineConfig({
	plugins: [
		// preact()
	],
	build: {
		outDir: "dist",
		sourcemap: true,
	},
	resolve: {
		alias: {
			react: "react",
			"react-dom": "react-dom",
			"react/jsx-runtime": "react/jsx-runtime",
		},
	},
});
