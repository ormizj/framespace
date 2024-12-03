import { deleteJwtToken } from '~/server/database/repositories/jwt';
import { getAuthHeader } from '~/server/utils/auth';
import { verifyJwt } from '~/server/utils/jwt';

export default defineEventHandler(async (event) => {
	const token = getAuthHeader(event) ?? '';
	const email = verifyJwt(token).email;
	await deleteJwtToken(email, token);
	return token;
});
