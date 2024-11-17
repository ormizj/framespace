import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '~/server/database/schemas';

export default defineNitroPlugin((nitroApp) => {
	// @ts-ignore: type not inherited
	nitroApp.$drizzle = drizzle(createClient({ url: 'file:server/local.db' }), {
		schema,
	});
});
