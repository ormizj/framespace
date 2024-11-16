import axios from 'axios';

export default defineNuxtPlugin(() => {
	axios.interceptors.request.use((config) => {
		const token = localStorage.getItem('jwt');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});
});
