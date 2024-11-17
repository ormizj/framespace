import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '~/server/database/schemas';
import { getEnv } from '~/server/composables/env';

export default defineNitroPlugin((nitroApp) => {
	// @ts-ignore: type not inherited
	nitroApp.$drizzle = drizzle(createClient({ url: getEnv('DB_FILE_NAME') }), {
		schema,
	});
});
