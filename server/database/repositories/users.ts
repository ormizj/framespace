import { tables, useDrizzle } from '~/server/composables/drizzle';
import { eq } from 'drizzle-orm';

const db = useDrizzle();
const table = tables.users;

export const getUserByEmail = async (email: string) => {
	try {
		email = email.toLowerCase();
		const users = await db
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
		email = email.toLowerCase();
		const users = await db
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
		email = email.toLowerCase();
		await db.insert(table).values({
			email,
			password,
		});
	} catch (error) {
		console.log(error);
	}
};
