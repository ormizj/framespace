import jwt from 'jsonwebtoken';

const jwtSecret = useRuntimeConfig().jwtSecret;

export const signJwt = (email: string) => {
	return jwt.sign(
		{
			email,
		},
		jwtSecret
	);
};

export const verifyJwt = (token?: string): JwtData => {
	if (!token) {
		return {
			email: '',
			iat: -1,
		};
	}
	return jwt.verify(token, jwtSecret) as JwtData;
};
