import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	outExtension() {
		return { js: ".mjs" };
	},
	banner() {
		return { js: "#!/usr/bin/env node" };
	},
	clean: true,
	splitting: false,
});
