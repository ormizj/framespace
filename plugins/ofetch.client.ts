export default defineNuxtPlugin({
	name: 'ofetch',
	async setup() {
		const authStore = useAuthStore();
		const { jwt } = storeToRefs(authStore);

		globalThis.$fetch = $fetch.create({
			onRequest: ({ options }) => {
				const localJwt = jwt.value ?? localStorage.getItem('jwt');
				if (localJwt) {
					options.headers.set('Authorization', `Bearer ${localJwt}`);
				}
			},
		});
	},
});
