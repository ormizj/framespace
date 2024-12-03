import { verifyJwt } from '~/server/utils/jwt';
import { getAuthHeader } from '~/server/utils/auth';

export default defineEventHandler(async (event): Promise<JwtData> => {
	return verifyJwt(getAuthHeader(event));
});
