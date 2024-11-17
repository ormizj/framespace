import {
	addUser,
	isUserExistsByEmail,
} from '~/server/database/repositories/users';
import { hashPassword } from '~/server/utils/crypto';
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

	if (await isUserExistsByEmail(email)) {
		throw createError({
			statusCode: 409,
			statusMessage: 'A user with this email already exists.',
		});
	}

	const hashedPassword = hashPassword(password);
	await addUser(email, hashedPassword);

	const jwt = signJwt(email);
	addJwtToken(email, jwt).then();
	return jwt;
});
