type envKey =
	| 'JWT_SECRET'
	| 'PBKDF2_SALT'
	| 'PBKDF2_ITERATIONS'
	| 'PBKDF2_LENGTH'
	| 'PBKDF2_DIGEST'
	| 'DB_FILE_NAME';

export const getEnv = (key: envKey): string => {
	return process.env[key] as string;
};
