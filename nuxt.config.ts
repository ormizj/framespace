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

	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],

	nitro: {
		preset: 'cloudflare-pages',
	},

	modules: ['@nuxthub/core', '@pinia/nuxt'],

	hub: {
		// https://hub.nuxt.com/docs/features/database, https://hub.nuxt.com/docs/recipes/drizzle
		database: true,
	},

	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
});
