import { getUserByEmail } from '~/server/database/repositories/users';
import { compareHashedPassword } from '~/server/utils/crypto';
import { signJwt } from '~/server/utils/jwt';
import { addJwtToken } from '~/server/database/repositories/jwt';

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);

	if (password === '' || !/^[^@]+@[^@]/.test(email)) {
		throw createError({
			statusCode: 422,
			statusMessage: 'Please provide a valid email and password.',
		});
	}

	const user = await getUserByEmail(email);
	if (!user) {
		throw createError({
			statusCode: 409,
			statusMessage: 'A user with this email does not exist.',
		});
	}

	if (!compareHashedPassword(event, password, user.password)) {
		throw createError({
			statusCode: 409,
			statusMessage: 'User password is incorrect.',
		});
	}

	const jwt = signJwt(email, event);
	addJwtToken(jwt).then();
	return jwt;
});
