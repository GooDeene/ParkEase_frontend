export const getTomorrowDate = (): Date => {
	const today = new Date();
	today.setDate(today.getDate() + 1);

	return today;
};
