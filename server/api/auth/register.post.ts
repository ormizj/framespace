import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
	const { login, password } = await readBody(event);
	const hashedPassword = await bcrypt.hash(
		password,
		useRuntimeConfig(event).saltRounds
	);

	console.log(useRuntimeConfig(event).saltRounds);

	// TODO create account
});
