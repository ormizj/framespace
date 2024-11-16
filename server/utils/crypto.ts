import { pbkdf2Sync } from 'node:crypto';

export const hashPassword = (
	event: Parameters<typeof useRuntimeConfig>[0],
	password: string
): string => {
	const { pbkdf2Salt, pbkdf2Iterations, pbkdf2Length, pbkdf2Digest } =
		useRuntimeConfig(event);

	/*
	https://community.cloudflare.com/t/site-gets-internal-server-error-500-message/206526/4
	"pbkdf2Sync" causes 500 error
	*/
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
