// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		// JWT
		jwtSecret: process.env.JWT_SECRET,
		// BCRYPT
		bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,

		public: {},
	},

	// ... your existing config
	app: {
		baseURL: '/framespace/', // Matches your GitHub Pages URL
	},
	ssr: false, // For static site deployment

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
