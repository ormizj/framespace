import type { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../database/schemas/index';

export const tables = schema;
export const useDrizzle = () => {
	// @ts-ignore: type not inherited
	return useNitroApp().$drizzle as ReturnType<typeof drizzle<typeof schema>>;
};
