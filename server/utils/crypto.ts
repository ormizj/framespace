import { pbkdf2Sync } from 'node:crypto';
import { getEnv } from '~/server/composables/env';

// todo change to bcrypt

export const hashPassword = (password: string): string => {
	const pbkdf2Salt = getEnv('PBKDF2_SALT');
	const pbkdf2Iterations = getEnv('PBKDF2_ITERATIONS');
	const pbkdf2Length = getEnv('PBKDF2_LENGTH');
	const pbkdf2Digest = getEnv('PBKDF2_DIGEST');

	return pbkdf2Sync(
		password,
		pbkdf2Salt,
		+pbkdf2Iterations,
		+pbkdf2Length,
		pbkdf2Digest
	).toString('hex');
};

export const compareHashedPassword = (
	password: string,
	hashedPassword: string
) => {
	return hashPassword(password) === hashedPassword;
};
