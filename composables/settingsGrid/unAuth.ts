import GridCell from '~/classes/GridCell';
import SettingButtonCell from '~/components/cells/setting-button-cell.vue';
import { useAuthStore } from '~/stores/auth';

export default () => {
	const authStore = useAuthStore();
	if (!authStore.isLoggedIn) return [];

	const handleLogout = () => {
		authStore.logout();
	};

	return [
		new GridCell({
			id: 'auth_logout',
			yGrid: 1,
			xGrid: 1,
			height: 1,
			width: 2,
			component: {
				is: SettingButtonCell,
				props: {
					title: 'Logout',
					onClick: handleLogout,
				},
			},
		}),
	];
};
