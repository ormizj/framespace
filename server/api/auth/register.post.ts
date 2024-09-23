import bcrypt from 'bcrypt';
import { addUser, isUserExistsByEmail } from '~/server/database/queries/users';

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

	const hashedPassword = await bcrypt.hash(
		password,
		useRuntimeConfig(event).saltRounds
	);
	await addUser(email, hashedPassword);

	return 'User created successfully.';
});
