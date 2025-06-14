import { formatDateToRU } from './formatDateToRU';
import { isDatesEqual } from './isDatesEqual';

/**
 * Функция формирует строку для отображения интервала переданных дат.
 * @param param0
 * @returns
 */
export const getDatesPeriod = ([start, end]: [Date | null, Date | null]): string => {
	if (end) {
		if (isDatesEqual(start, end)) {
			return start ? formatDateToRU(start) : '';
		}

		return start
			? `${formatDateToRU(start)} – ${formatDateToRU(end)}`
			: 'Некорректный интервал';
	} else {
		return start ? formatDateToRU(start) : '';
	}
};
