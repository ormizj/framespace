import { usePrisma } from '~/server/composables/prisma';

const db = usePrisma();

export const getUserByEmail = async (email: string) => {
	try {
		email = email.toLowerCase();
		return await db.user.findFirst({
			where: { email },
		});
	} catch (error) {
		console.error(error);
	}
};

export const isUserExistsByEmail = async (email: string) => {
	try {
		email = email.toLowerCase();
		const user = await db.user.findFirst({
			where: { email },
		});

		return user !== null;
	} catch (error) {
		console.error(error);
	}
};

export const addUser = async (email: string, password: string) => {
	try {
		email = email.toLowerCase();
		await db.user.create({
			data: {
				email,
				password,
			},
		});
	} catch (error) {
		console.error(error);
	}
};
