import { usePrisma } from '~/server/composables/prisma';

const prisma = usePrisma;

export const addJwtToken = async (email: string, token: string) => {
	try {
		await prisma().$transaction([
			prisma.jwt.deleteMany({
				where: { email },
			}),

			// Then insert new token
			prisma.jwt.create({
				data: {
					token,
					email,
				},
			}),
		]);
	} catch (error) {
		console.log(error);
	}
};

export const isJwtTokenExistByToken = async (token: string, email: string) => {
	try {
		const tokenExists = await prisma().jwt.findFirst({
			where: {
				email,
				token,
			},
		});

		return tokenExists !== null;
	} catch (error) {
		console.log(error);
	}
};
