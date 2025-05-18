import clsx from 'clsx';
import Button from '../../_button/Button';
import Switch from '../../_switch/Switch';
import { Icon } from '../../Constants';

import './CalendarHeader.css';
import { useContext } from 'react';
import { DatepickerContext } from '../Datepicker';

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
	// const context = useContext(DatepickerContext);
	// const useRangeMode = context?.useRangeMode;

	const headerClassName = clsx('controls-datepicker__header');
	const arrowCalssName = 'controls-datepicker__arrow';
	const swicthBlockClassName = clsx('controls-datepicker__switchBlock');
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

	const switchChangedHandler = (value: string) => {
		// useRangeMode?.[1](() => value === 'period');
	};

	return (
		<div className={headerClassName}>
			{/* <div className={swicthBlockClassName}>
				<span>Выбрать</span>
				<Switch
					className='controls-datepicker__switch'
					items={{
						left: { title: 'Дату', value: 'date' },
						right: { title: 'Период', value: 'period' },
					}}
					onValueChanged={switchChangedHandler}
				/>
			</div> */}
			<div className={buttonsClassName}>
				<Button
					className={clsx(arrowCalssName, 'controls-datepicker__arrow_reversed')}
					icon={Icon.nextArrow}
					iconSizes={{ height: 20, width: 20 }}
					onClick={decreaseMonth}
					disabled={prevMonthButtonDisabled}
				/>
				<div className={dateClassName}>
					<span>{formatDate(date)}</span>
					{!isSameDates(date, new Date()) && (
						<Button
							icon={Icon.home}
							iconSizes={{ width: 24, height: 24 }}
							onClick={homeClickHandler}
						/>
					)}
				</div>
				<Button
					className={arrowCalssName}
					icon={Icon.nextArrow}
					iconSizes={{ height: 20, width: 20 }}
					onClick={increaseMonth}
					disabled={nextMonthButtonDisabled}
				/>
			</div>
		</div>
	);
};

export default CalendarHeader;
