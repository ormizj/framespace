import { tables, useDrizzle } from '~/server/composables/drizzle';
import { and, eq } from 'drizzle-orm';

const db = useDrizzle();
const table = tables.jwt;

export const addJwtToken = async (email: string, token: string) => {
	try {
		await db.batch([
			// TODO currently only support 1 login instance
			db.delete(table).where(eq(table.email, email)),

			db.insert(table).values({
				token,
				email,
			}),
		]);
	} catch (error) {
		console.error(error);
	}
};

export const deleteJwtToken = async (email: string, token: string) => {
	try {
		await db.delete(table).values({
			email,
			token,
		});
	} catch (error) {
		console.error(error);
	}
};

export const isJwtTokenExistByToken = async (token: string, email: string) => {
	try {
		email = email.toLowerCase();
		const tokens = await db
			.select()
			.from(table)
			.where(and(eq(table.email, email), eq(table.token, token)))
			.limit(1);

		return tokens.length !== 0;
	} catch (error) {
		console.error(error);
	}
};
