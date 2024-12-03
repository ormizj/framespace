import { usePrisma } from '~/server/composables/prisma';

const db = usePrisma();

export const addJwtToken = async (email: string, token: string) => {
	try {
		await db.$transaction([
			// TODO currently only support 1 login instance
			db.jwt.deleteMany({
				where: { email },
			}),
			db.jwt.create({
				data: {
					token,
					email,
				},
			}),
		]);
	} catch (error) {
		console.error(error);
	}
};

export const deleteJwtToken = async (email: string, token: string) => {
	try {
		await db.jwt.delete({
			where: { email, token },
		});
	} catch (error) {
		console.error(error);
	}
};

export const isJwtTokenExistByToken = async (email: string, token: string) => {
	try {
		email = email.toLowerCase();
		const tokenExists = await db.jwt.findFirst({
			where: {
				email,
				token,
			},
		});

		return tokenExists !== null;
	} catch (error) {
		console.error(error);
	}
};
