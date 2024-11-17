import { getEnv } from '~/server/composables/env';
import bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
	return bcrypt.hashSync(password, +getEnv('BCRYPT_SALT_ROUNDS'));
};

export const compareHashedPassword = (
	password: string,
	hashedPassword: string
) => {
	return bcrypt.compareSync(password, hashedPassword);
};
