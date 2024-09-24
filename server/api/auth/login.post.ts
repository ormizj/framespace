import { getUserByEmail } from '~/server/database/repositories/users';
import { compareHashedPassword } from '~/server/utils/crypto';

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

	if (!(await compareHashedPassword(event, password, user.password))) {
		throw createError({
			statusCode: 409,
			statusMessage: 'User password is incorrect.',
		});
	}

	return 'User logged in.';
});
