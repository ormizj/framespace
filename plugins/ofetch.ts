export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();
	const { jwt } = storeToRefs(authStore);

	globalThis.$fetch = $fetch.create({
		onRequest: ({ options }) => {
			options.headers.set('Authorization', `Bearer ${jwt.value}`);
		},
	});
});
