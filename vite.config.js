import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	base: "/bright-asteroids",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./js"),
		},
	},
});
