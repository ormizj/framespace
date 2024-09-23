import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore({
	id: 'auth',

	state: () => ({
		email: '',
		jwtToken: '',
	}),

	getters: {
		isLoggedIn(): boolean {
			return this.jwtToken !== '';
		},
	},

	actions: {
		login(email: string, password: string) {
			axios.post('api/auth/login', { email, password });
		},
		register(email: string, password: string) {
			axios.post('api/auth/register', { email, password });
		},
	},
});

import.meta.hot?.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
