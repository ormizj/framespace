import { eq, tables, useDrizzle } from '~/server/composables/drizzle';

const db = useDrizzle;
const table = tables.jwt;

export const addJwtToken = async (token: string) => {
	try {
		await db().insert(table).values({
			token,
		});
	} catch (e) {}
};

export const isJwtTokenExistByToken = async (token: string) => {
	try {
		const tokens = await db()
			.select()
			.from(table)
			.where(eq(table.token, token))
			.limit(1);

		return tokens.length !== 0;
	} catch (e) {}
};
