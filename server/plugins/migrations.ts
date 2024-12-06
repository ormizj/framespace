import { migrate } from 'drizzle-orm/d1/migrator';

export default defineNitroPlugin(async (nitroApp) => {
	if (import.meta.dev) return;

	try {
		// @ts-ignore: type not inherited
		await migrate(nitroApp.$drizzle, {
			migrationsFolder: 'server/database/migrations',
		});
		console.log('✔ Database migrations done');
	} catch (e) {
		console.error('Database migrations failed', e);
	}
});
