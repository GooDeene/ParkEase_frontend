/**
 * Возвращает "период" или "дату" в зависимости от переданного диапазона дат
 */
export const getDatePeriodTitle = (start: Date | null, end: Date | null): string => {
	if (end) {
		if (start) {
			return 'период';
		} else {
			return 'дату';
		}
	}

	return 'дату';
};
