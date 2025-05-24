export const isDatesEqual = (first: Date | null, second: Date | null) => {
	return (
		first?.getFullYear() === second?.getFullYear() &&
		first?.getMonth() === second?.getMonth() &&
		first?.getDate() === second?.getDate()
	);
};
