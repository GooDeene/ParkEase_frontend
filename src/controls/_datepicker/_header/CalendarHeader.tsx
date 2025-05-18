import clsx from 'clsx';
import Button from '../../_button/Button';

import './CalendarHeader.css';
import HomeIcon from '../../_icons/HomeIcon';
import NextArrowIcon from '../../_icons/NextArrowIcon';

/**
 * Функция форматирования переданной даты для отображения в шапке календаря.
 * @param date Дата.
 * @returns
 */
const formatDate = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
	};
	const str = date.toLocaleDateString('ru-RU', options).slice(0, -3);

	return str.charAt(0).toUpperCase() + str.slice(1);
};

const isSameDates = (date1: Date, date2: Date): boolean => {
	const months = [date1.getMonth(), date2.getMonth()];
	const years = [date1.getFullYear(), date2.getFullYear()];

	return years[0] === years[1] && months[0] === months[1];
};

interface ICalendarHeaderProps {
	changeYear: (value: number) => void;
	changeMonth: (value: number) => void;
	date: Date;
	decreaseMonth: () => void;
	increaseMonth: () => void;
	prevMonthButtonDisabled: boolean;
	nextMonthButtonDisabled: boolean;
}

const CalendarHeader = ({
	changeYear,
	changeMonth,
	date,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
}: ICalendarHeaderProps) => {
	const headerClassName = clsx('controls-datepicker__header');
	const arrowCalssName = 'controls-datepicker__arrow';
	const buttonsClassName = clsx('controls-datepicker__buttonsBlock');
	const dateClassName = clsx(
		'controls-datepicker__headerDate',
		'controls-fontsize-20',
		'controls-fontweight-medium'
	);

	const homeClickHandler = () => {
		const now = new Date();

		changeMonth(now.getMonth());
		changeYear(now.getFullYear());
	};

	return (
		<div className={headerClassName}>
			<div className={buttonsClassName}>
				<Button
					className={clsx(arrowCalssName, 'controls-datepicker__arrow_reversed')}
					icon={<NextArrowIcon size={24} />}
					onClick={decreaseMonth}
					disabled={prevMonthButtonDisabled}
				/>
				<div className={dateClassName}>
					<span>{formatDate(date)}</span>
					{!isSameDates(date, new Date()) && (
						<Button
							icon={<HomeIcon size={18} />}
							onClick={homeClickHandler}
						/>
					)}
				</div>
				<Button
					className={arrowCalssName}
					icon={<NextArrowIcon size={24} />}
					onClick={increaseMonth}
					disabled={nextMonthButtonDisabled}
				/>
			</div>
		</div>
	);
};

export default CalendarHeader;
