// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		// JWT
		jwtSecret: process.env.JWT_SECRET,

		// PBKDF2
		pbkdf2Salt: process.env.PBKDF2_SALT,
		pbkdf2Iterations: process.env.PBKDF2_ITERATIONS,
		pbkdf2Length: process.env.PBKDF2_LENGTH,
		pbkdf2Digest: process.env.PBKDF2_DIGEST,

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
