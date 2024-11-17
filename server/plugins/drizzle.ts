import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '~/server/database/schemas';

export default defineNitroPlugin(() => {
	useNitroApp().$drizzle = drizzle(
		createClient({ url: 'file:server/local.db' }),
		{ schema }
	);
});
