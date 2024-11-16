import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';

export const useAuthStore = defineStore({
	id: 'auth',

	state: () => ({
		jwt: '',
	}),

	getters: {
		isLoggedIn(): boolean {
			return !!this.jwt;
		},
	},

	actions: {
		init() {
			this.jwt = localStorage.getItem('jwt') ?? '';
		},
		async login(email: string, password: string) {
			try {
				const res = await axios.post<string>('api/auth/login', {
					email,
					password,
				});
				localStorage.setItem('jwt', res.data);
				this.jwt = res.data;
			} catch (error) {
				const axiosError = error as AxiosError;
				alert(axiosError.response!.statusText);
			}
		},
		register(email: string, password: string) {
			axios.post('api/auth/register', { email, password }).then();
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
