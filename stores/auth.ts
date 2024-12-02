import { defineStore } from 'pinia';
import type { IFetchError } from 'ofetch';

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
		_init() {
			// TODO login validation, then validate returned data (email) with current email
			this.jwt = localStorage.getItem('jwt') ?? '';
			this.email = localStorage.getItem('email') ?? '';
		},
		async login(email: string, password: string) {
			try {
				const jwt = await $fetch<string>('api/auth/login', {
					method: 'POST',
					body: {
						email,
						password,
					},
				});
				this._clientLogin(email, jwt);
			} catch (error) {
				const iFetchError = error as IFetchError;
				alert(iFetchError.data.message);
			}
		},
		logout() {
			const jwt = this.jwt;
			const email = this.email;
			$fetch('api/auth/logout', { method: 'DELETE' }).catch(() => {
				this._clientLogin(email, jwt);
			});
			this._clientLogout();
		},
		async register(email: string, password: string) {
			try {
				const jwt = await $fetch<string>('api/auth/register', {
					method: 'POST',
					body: {
						email,
						password,
					},
				});
				this._clientLogin(email, jwt);
			} catch (error) {
				const iFetchError = error as IFetchError;
				alert(iFetchError.data.message);
			}
		},
		_clientLogin(email: string, jwt: string) {
			localStorage.setItem('jwt', jwt);
			localStorage.setItem('email', email.toLowerCase());
			this.jwt = jwt;
			this.email = email.toLowerCase();
		},
		_clientLogout() {
			localStorage.removeItem('jwt');
			localStorage.removeItem('email');
			this.jwt = '';
			this.email = '';
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
