import jwt from 'jsonwebtoken';
import { H3Event } from 'h3';

export const signJwt = (username: string, event: H3Event) => {
	const { jwtSecret } = useRuntimeConfig(event);

	return jwt.sign(
		{
			username,
		},
		jwtSecret
	);
};
