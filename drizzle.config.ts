import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './server/database/schemas/*',
	out: './server/database/migrations',
});
