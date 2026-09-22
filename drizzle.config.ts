import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dbCredentials: {
		url: process.env["AI_DATABASE_PATH"] ?? "data/typescript-tutor.sqlite",
	},
	dialect: "sqlite",
	out: "./drizzle",
	schema: "./src/ai/schema.ts",
	strict: true,
	verbose: true,
});
