import { pbkdf2Sync } from 'node:crypto';

export const hashPassword = (
	event: Parameters<typeof useRuntimeConfig>[0],
	password: string
): string => {
	const { pbkdf2Salt, pbkdf2Iterations, pbkdf2Length, pbkdf2Digest } =
		useRuntimeConfig(event);

	console.log(pbkdf2Salt, pbkdf2Iterations, pbkdf2Length, pbkdf2Digest);

	return pbkdf2Sync(
		password,
		pbkdf2Salt,
		+pbkdf2Iterations,
		+pbkdf2Length,
		pbkdf2Digest
	).toString('hex');
};

export const compareHashedPassword = (
	event: Parameters<typeof useRuntimeConfig>[0],
	password: string,
	hashedPassword: string
) => {
	return hashPassword(event, password) === hashedPassword;
};
