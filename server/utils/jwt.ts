import jwt from 'jsonwebtoken';
import { getEnv } from '~/server/composables/env';

export const signJwt = (email: string) => {
	return jwt.sign(
		{
			email,
		},
		getEnv('JWT_SECRET')
	);
};
