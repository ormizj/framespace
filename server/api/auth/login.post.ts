import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
	const { login, password } = await readBody(event);
	const hashedPassword = ''; // TODO get password

	if (await bcrypt.compare(password, hashedPassword)) {
	}
});
