// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		saltRounds: 10,
		public: {},
	},

	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],

	// alias: {
	// 	string_decoder: 'string_decoder/',
	// },

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
