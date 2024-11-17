import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../database/schemas/index';

export const tables = schema;

export function useDrizzle() {
	return drizzle(createClient({ url: 'file:server/local.db' }), { schema });
}
