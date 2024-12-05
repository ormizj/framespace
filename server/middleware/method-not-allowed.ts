export default defineEventHandler((event) => {
	if (event.node.req.method === 'OPTIONS') return null;
});
