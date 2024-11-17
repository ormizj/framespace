// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		// JWT
		jwtSecret: process.env.JWT_SECRET,
		// BCRYPT
		bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
		// DRIZZLE
		dbFileName: process.env.DB_FILE_NAME,

		public: {},
	},

	modules: ['@pinia/nuxt'],

	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],

	devtools: { enabled: true },
	compatibilityDate: '2024-09-24',
});
