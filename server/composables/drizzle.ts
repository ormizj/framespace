import { drizzle } from 'drizzle-orm/d1';
export { sql, eq, and, or } from 'drizzle-orm';

import * as schema from '../database/schemas/index';

export const tables = schema;

// Drizzle Database (https://hub.nuxt.com/docs/recipes/drizzle)
export function useDrizzle() {
	return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.users.$inferSelect;
