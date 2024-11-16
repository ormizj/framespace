import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';

export const useAuthStore = defineStore({
	id: 'auth',

	state: () => ({
		email: '',
		jwt: '',
	}),

	getters: {
		isLoggedIn(): boolean {
			return !!this.jwt;
		},
	},

	actions: {
		async login(email: string, password: string) {
			try {
				const res = await axios.post<string>('api/auth/login', {
					email,
					password,
				});
				this._clientLogin(email, res.data);
			} catch (error) {
				const axiosError = error as AxiosError;
				alert(axiosError.response!.statusText);
			}
		},
		async register(email: string, password: string) {
			try {
				const res = await axios.post<string>('api/auth/register', {
					email,
					password,
				});
				this._clientLogin(email, res.data);
			} catch (error) {
				const axiosError = error as AxiosError;
				alert(axiosError.response!.statusText);
			}
		},
		init() {
			this.jwt = localStorage.getItem('jwt') ?? '';
			this.email = localStorage.getItem('email') ?? '';
		},
		logout() {
			localStorage.removeItem('jwt');
			localStorage.removeItem('email');
			this.jwt = '';
			this.email = '';
		},
		_clientLogin(email: string, jwt: string) {
			localStorage.setItem('jwt', jwt);
			localStorage.setItem('email', email);
			this.jwt = jwt;
			this.email = email;
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
