import 'dotenv/config';
import * as schema from '~/server/database/schemas/index';

export const tables = schema;

export const usePrisma = () => {
	// @ts-ignore: type not inherited
	return useNitroApp().$prisma;
};
