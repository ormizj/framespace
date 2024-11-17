import 'dotenv/config';
import * as schema from '../database/schemas/index';

export const tables = schema;

export function useDrizzle() {
	return useNitroApp().$drizzle;
}
