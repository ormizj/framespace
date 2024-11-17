import bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
	return bcrypt.hashSync(password, +useRuntimeConfig().bcryptSaltRounds);
};

export const compareHashedPassword = (
	password: string,
	hashedPassword: string
) => {
	return bcrypt.compareSync(password, hashedPassword);
};
