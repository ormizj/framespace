import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
	const { email, password } = await readBody(event);
	const hashedPassword = ''; // TODO get password

	if (password === '' || !/^[^@]+@[^@]/.test(email)) {
		throw createError({
			statusCode: 422,
			statusMessage: 'Please provide a valid email and password.',
		});
	}

	if (await bcrypt.compare(password, hashedPassword)) {
	}
});
