import type { drizzle } from 'drizzle-orm/libsql';
import * as schema from '~/server/database/schemas';

declare module 'nitro/types' {
	interface NitroApp {
		$drizzle: typeof drizzle<typeof schema>;
	}
}
