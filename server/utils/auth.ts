import { H3Event } from 'h3';

export const getAuthHeader = (event: H3Event): string | undefined => {
	const authHeader = getHeader(event, 'Authorization');
	return authHeader?.split('Bearer ')[1];
};
