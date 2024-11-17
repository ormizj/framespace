type envKey = 'JWT_SECRET' | 'BCRYPT_SALT_ROUNDS' | 'DB_FILE_NAME';

export const getEnv = (key: envKey): string => {
	return process.env[key] as string;
};
