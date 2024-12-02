export default defineNuxtPlugin({
	name: 'auth',
	dependsOn: ['ofetch'],
	async setup() {
		useAuthStore()._init();
	},
});
