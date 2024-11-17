import { consola } from 'consola';
import { migrate } from 'drizzle-orm/d1/migrator';
import { useDrizzle } from '../composables/drizzle';

export default defineNitroPlugin(async () => {
	if (!import.meta.dev) return;

	await migrate(useDrizzle(), {
		migrationsFolder: 'server/database/migrations',
	})
		.then(() => {
			console.log('Database migrations done');
		})
		.catch((e) => {
			console.error('Database migrations failed', e);
		});
});
