import 'dotenv/config';
import * as schema from '../database/schemas/index';

export const tables = schema;

export function useDrizzle() {
	// @ts-ignore: type not inherited
	return useNitroApp().$drizzle;
}
