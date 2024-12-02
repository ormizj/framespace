import GridCell from '~/classes/GridCell';
import SettingLabelCell from '~/components/cells/setting-label-cell.vue';
import SettingLabelInputCell from '~/components/cells/setting-label-input-cell.vue';
import SettingButtonCell from '~/components/cells/setting-button-cell.vue';
import { useAuthStore } from '~/stores/auth';
import { focusElement } from '~/utils/gridCellElement';

export default () => {
	const authStore = useAuthStore();
	if (authStore.isLoggedIn) return [];

	const email = ref('');
	const password = ref('');
	const emailRef = ref<HTMLInputElement | null>(null);
	const passwordRef = ref<HTMLInputElement | null>(null);
	const registerRef = ref<HTMLButtonElement | null>(null);
	const loginRef = ref<HTMLButtonElement | null>(null);

	const handleLogin = () => {
		if (
			!validateElement(emailRef.value!) ||
			!validateElement(passwordRef.value!)
		) {
			return;
		}
		authStore.login(email.value, password.value).then();
	};
	const handleRegister = () => {
		if (
			!validateElement(emailRef.value!) ||
			!validateElement(passwordRef.value!)
		) {
			return;
		}
		authStore.register(email.value, password.value);
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
					forId: 'email',
				},
			},
		}),
		new GridCell({
			id: 'auth_email',
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
					'form': 'auth',
					'setRef': (componentRef: HTMLInputElement) => {
						emailRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, loginRef.value!, passwordRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'auth_password',
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
					'type': 'password',
					'form': 'auth',
					'required': true,
					'setRef': (componentRef: HTMLInputElement) => {
						passwordRef.value = componentRef;
					},
					'onKeydown': (event: KeyboardEvent) => {
						focusElement(event, emailRef.value!, registerRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'auth_register',
			yGrid: 4,
			xGrid: 1,
			height: 1,
			width: 1,
			component: {
				is: SettingButtonCell,
				props: {
					title: 'Register',
					form: 'auth',
					onClick: handleRegister,
					setRef: (componentRef: HTMLButtonElement) => {
						registerRef.value = componentRef;
					},
					onKeydown: (event: KeyboardEvent) => {
						focusElement(event, passwordRef.value!, loginRef.value!);
					},
				},
			},
		}),
		new GridCell({
			id: 'auth_login',
			yGrid: 4,
			xGrid: 2,
			height: 1,
			width: 1,
			component: {
				is: SettingButtonCell,
				props: {
					title: 'Login',
					type: 'submit',
					form: 'auth',
					onClick: handleLogin,
					setRef: (componentRef: HTMLButtonElement) => {
						loginRef.value = componentRef;
					},
					onKeydown: (event: KeyboardEvent) => {
						focusElement(event, registerRef.value!, emailRef.value!);
					},
				},
			},
		}),
	];
};
