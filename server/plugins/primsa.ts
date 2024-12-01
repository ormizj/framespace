import { PrismaClient } from '@prisma/client';

export default defineNitroPlugin((nitroApp) => {
	const prisma = new PrismaClient();

	try {
		// @ts-ignore: type not inherited
		nitroApp.$prisma = prisma;
		console.log('✔ Prisma client initialized successfully');
	} catch (error) {
		console.error('Failed to initialize Prisma:', error);
	}
});
