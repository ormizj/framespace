import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event): Promise<JwtData> => {
	const authHeader = getHeader(event, 'Authorization');
	const token = authHeader?.split('Bearer ')[1] || null;
	if (!token) return { iat: -1, email: '' };
	return jwt.verify(token, useRuntimeConfig(event).jwtSecret) as JwtData;
});
