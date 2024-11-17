import { migrate } from 'drizzle-orm/d1/migrator';
import { useDrizzle } from '../composables/drizzle';

export default defineNitroPlugin(async (nitroApp) => {
	if (!import.meta.dev) return;

	// @ts-ignore: type not inherited
	await migrate(nitroApp.$drizzle, {
		migrationsFolder: 'server/database/migrations',
	})
		.then(() => {
			console.log('✔ Database migrations done');
		})
		.catch((e) => {
			console.error('Database migrations failed', e);
		});
});
