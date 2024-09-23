import GridCell from '~/classes/GridCell';
import SettingLabelCell from '~/components/cells/setting-label-cell.vue';
import SettingLabelInputCell from '~/components/cells/setting-label-input-cell.vue';
import SettingButtonCell from '~/components/cells/setting-button-cell.vue';

export default () => {
	const email = ref('');
	const password = ref('');
	const emailRef = ref<HTMLInputElement | null>(null);
	const passwordRef = ref<HTMLInputElement | null>(null);

	const handleLogin = () => {
		if (!validateElement(emailRef.value!)) return;
		if (!validateElement(passwordRef.value!)) return;
		console.log(email.value);
		console.log(password.value);
	};
	const handleRegister = () => {
		if (!validateElement(emailRef.value!)) return;
		if (!validateElement(passwordRef.value!)) return;
		console.log(email.value);
		console.log(password.value);
	};

	return [
		new GridCell({
			id: 'auth',
			yGrid: 1,
			xGrid: 1,
			height: 1,
			width: 2,
			component: {
				is: SettingLabelCell,
				props: {
					title: 'Login',
					id: 'login',
				},
			},
		}),
		new GridCell({
			id: 'auth-email',
			yGrid: 2,
			xGrid: 1,
			height: 1,
			width: 2,
			component: {
				is: SettingLabelInputCell,
				props: {
					'v-model': email,
					'modelValue': email,
					'onUpdate:modelValue': (value: string) => (email.value = value),
					'title': 'Email',
					'id': 'email',
					'type': 'email',
					'required': true,
					'setRef': (componentRef: HTMLInputElement) => {
						emailRef.value = componentRef;
					},
				},
			},
		}),
		new GridCell({
			id: 'auth-password',
			yGrid: 3,
			xGrid: 1,
			height: 1,
			width: 2,
			component: {
				is: SettingLabelInputCell,
				props: {
					'v-model': password,
					'modelValue': password,
					'onUpdate:modelValue': (value: string) => (password.value = value),
					'title': 'Password',
					'id': 'password',
					'type': 'text',
					'required': true,
					'setRef': (componentRef: HTMLInputElement) => {
						passwordRef.value = componentRef;
					},
				},
			},
		}),
		new GridCell({
			id: 'auth-register',
			yGrid: 4,
			xGrid: 1,
			height: 1,
			width: 1,
			component: {
				is: SettingButtonCell,
				props: {
					title: 'Register',
					onClick: handleRegister,
				},
			},
		}),
		new GridCell({
			id: 'auth-login',
			yGrid: 4,
			xGrid: 2,
			height: 1,
			width: 1,
			component: {
				is: SettingButtonCell,
				props: {
					title: 'Login',
					onClick: handleLogin,
				},
			},
		}),
	];
};
