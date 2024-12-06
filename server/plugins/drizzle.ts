import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '~/server/database/schemas';

export default defineNitroPlugin((nitroApp) => {
	console.log(useRuntimeConfig().dbFileName);
	try {
		// @ts-ignore: type not inherited
		nitroApp.$drizzle = drizzle(
			createClient({ url: useRuntimeConfig().dbFileName }),
			{
				schema,
			}
		);
		console.log('✔ Drizzle ready');
	} catch (e) {
		console.error('Drizzle failed', e);
	}
});
