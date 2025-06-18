export const getTomorrowDate = (): Date => {
	const today = new Date();
	const romorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

	return romorrow;
};
