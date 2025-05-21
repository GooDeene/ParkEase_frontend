/**
 * Функция форматирования переданной даты для отображения в формате "DD-MM-YYYY"
 * @param date Дата.
 * @returns
 */
export const formatDateToCalendarHeader = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
	};
	const str = date.toLocaleDateString('ru-RU', options).slice(0, -3);

	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDateToRU = (date: Date): string => {
	const str = date.toLocaleDateString('ru-RU');

	return str.charAt(0).toUpperCase() + str.slice(1);
}