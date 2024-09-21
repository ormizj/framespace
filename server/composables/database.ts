export const useDatabase = () => {
	const db = hubDatabase();
	return db;
};
