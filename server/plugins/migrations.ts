import { migrate } from 'drizzle-orm/d1/migrator';
import { useDrizzle } from '../composables/drizzle';

export default defineNitroPlugin(async () => {
	if (!import.meta.dev) return;

	await migrate(useNitroApp().$drizzle, {
		migrationsFolder: 'server/database/migrations',
	})
		.then(() => {
			console.log('✔ Database migrations done');
		})
		.catch((e) => {
			console.error('Database migrations failed', e);
		});
});
