import { PrismaClient } from '@prisma/client';

declare module 'nitro/types' {
	interface NitroApp {
		$prisma: PrismaClient;
	}
}
