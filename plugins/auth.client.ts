export default defineNuxtPlugin(() => {
	useAuthStore().init();
});
