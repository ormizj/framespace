import { eq, tables, useDrizzle } from '~/server/composables/drizzle';

const db = useDrizzle;
const table = tables.users;

export const getUserByEmail = async (email: string) => {
	try {
		const users = await db()
			.select()
			.from(table)
			.where(eq(table.email, email))
			.limit(1);

		return users[0];
	} catch (error) {
		console.log(error);
	}
};

export const isUserExistsByEmail = async (email: string) => {
	try {
		const users = await db()
			.select()
			.from(table)
			.where(eq(table.email, email))
			.limit(1);

		return users.length !== 0;
	} catch (error) {
		console.log(error);
	}
};

export const addUser = async (email: string, password: string) => {
	try {
		await db().insert(table).values({
			email,
			password,
		});
	} catch (error) {
		console.log(error);
	}
};
