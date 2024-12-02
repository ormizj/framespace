import { deleteJwtToken } from '~/server/database/repositories/jwt';

export default defineEventHandler(async (event) => {
	const authHeader = getHeader(event, 'Authorization');
	const token = authHeader?.split('Bearer ')[1] ?? '';
	await deleteJwtToken(token);
	return token;
});
