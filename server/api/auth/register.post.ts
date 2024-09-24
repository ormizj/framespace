import {
	addUser,
	isUserExistsByEmail,
} from '~/server/database/repositories/users';
import { hashPassword } from '~/server/utils/crypto';

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

	const hashedPassword = hashPassword(event, password);
	await addUser(email, hashedPassword);

	return 'User created successfully.';
});
