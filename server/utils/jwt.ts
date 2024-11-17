import jwt from 'jsonwebtoken';

export const signJwt = (email: string) => {
	return jwt.sign(
		{
			email,
		},
		useRuntimeConfig().jwtSecret
	);
};
