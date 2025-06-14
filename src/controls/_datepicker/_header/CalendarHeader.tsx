import clsx from 'clsx';
import Button from '../../_button/Button';
import HomeIcon from '../../_icons/HomeIcon';
import NextArrowIcon from '../../_icons/NextArrowIcon';
import { formatDateToCalendarHeader } from '../../utils/formatDateToRU';
import './CalendarHeader.css';

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
	const dateClassName = clsx('controls-datepicker__headerDate', 'controls-fontweight-medium');

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
					<span>{formatDateToCalendarHeader(date)}</span>
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
