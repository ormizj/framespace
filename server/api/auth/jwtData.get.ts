import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
	const authHeader = getHeader(event, 'Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Invalid authorization header',
		});
	}

	const token = authHeader.split('Bearer ')[1];
	return jwt.verify(token, useRuntimeConfig(event).jwtSecret) as JwtData;
});
