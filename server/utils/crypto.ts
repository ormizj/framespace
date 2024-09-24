import crypto from 'crypto';

export const hashPassword = async (
	event: Parameters<typeof useRuntimeConfig>[0],
	password: string
): Promise<string> => {
	const { pbkdf2Salt, pbkdf2Iterations, pbkdf2Length, pbkdf2Digest } =
		useRuntimeConfig(event);

	const hashedPassword = await new Promise<string>((resolve, reject) => {
		crypto.pbkdf2(
			password,
			pbkdf2Salt,
			+pbkdf2Iterations,
			+pbkdf2Length,
			pbkdf2Digest,
			(err, derivedKey) => {
				if (err) {
					reject(err);
				} else {
					resolve(derivedKey.toString('hex'));
				}
			}
		);
	});

	return hashedPassword;
};

export const compareHashedPassword = async (
	event: Parameters<typeof useRuntimeConfig>[0],
	password: string,
	hashedPassword: string
) => {
	return (await hashPassword(event, password)) === hashedPassword;
};
