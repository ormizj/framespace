import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);
	const hashedPassword = await bcrypt.hash(
		password,
		useRuntimeConfig(event).saltRounds
	);

	if (password === '' || !/^[^@]+@[^@]/.test(email)) {
		throw createError({
			statusCode: 422,
			statusMessage: 'Please provide a valid email and password.',
		});
	}

	return 'success';
});
