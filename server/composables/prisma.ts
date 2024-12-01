export const usePrisma = () => {
	// @ts-ignore: type not inherited
	return useNitroApp().$prisma;
};
