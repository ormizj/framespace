import { usePrisma } from '~/server/composables/prisma';

const db = usePrisma();

export const addJwtToken = async (email: string, token: string) => {
	try {
		await db.$transaction([
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

export const isJwtTokenExistByToken = async (token: string, email: string) => {
	try {
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
