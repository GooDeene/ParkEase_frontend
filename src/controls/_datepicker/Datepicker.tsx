import DatePicker from 'react-datepicker';
import './Datepicker.css';
import { useState, type SyntheticEvent } from 'react';
import clsx from 'clsx';
import CalendarHeader from './_header/CalendarHeader';
import Button from '../_button/Button';
import CrossIcon from '../_icons/CrossIcon';

interface IDatepickerProps {
	placeholder?: string;
}

const getChosenDates = (start: Date | null, end: Date | null): string => {
	if (end) {
		if (start) {
			const isSame = start.toUTCString() === end.toUTCString();
			if (isSame) {
				return `${start.toLocaleDateString()}`;
			} else {
				return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`;
			}
		}

		return `— ${end.toLocaleDateString()}`;
	}

	if (start) {
		return start.toLocaleDateString();
	}

	return '';
};

const DEFAULT_PLACEHOLDER = 'Дата не выбрана';

const Datepicker = ({ placeholder }: IDatepickerProps) => {
	const [startDate, setStartDate] = useState<Date | null>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(new Date());
	const [isOpen, setIsOpen] = useState(false);

	const calendarClassName = clsx('controls-datepicker__calendar');
	const dayClassName = clsx('controls-datepicker__day');
	const dateCardClassName = clsx('controls-datepicker__dateCard', 'controls-fontsize-20');
	const overlayClassName = clsx('controls-datepicker__overlay');
	const rootClassName = clsx('controls-datepicker', 'controls-margin_top-2xl');

	const rootClickHandler = () => {
		setIsOpen((prev) => !prev);
	};

	const changeHandler = (value: [Date | null, Date | null]) => {
		setStartDate(() => value[0]);
		setEndDate(() => value[1]);
	};
	const title = getChosenDates(startDate, endDate);

	return (
		<div className={rootClassName}>
			{isOpen && (
				<div
					className={overlayClassName}
					onClick={() => setIsOpen(() => false)}
				/>
			)}
			<div
				className={dateCardClassName}
				onClick={rootClickHandler}
			>
				{title}
				{!title && (
					<span className='controls-datepicker__placeholder'>
						{placeholder || DEFAULT_PLACEHOLDER}
					</span>
				)}
				{title && (
					<Button
						className={clsx('controls-datepicker__reset', 'controls-margin_right-xs')}
						icon={<CrossIcon size={24} />}
						onClick={(e: SyntheticEvent) => {
							e.stopPropagation();
							setStartDate(() => null);
							setEndDate(() => null);
						}}
					/>
				)}
			</div>
			{isOpen && (
				<DatePicker
					calendarClassName={calendarClassName}
					startDate={startDate}
					endDate={endDate}
					onChange={changeHandler}
					renderCustomHeader={CalendarHeader}
					dayClassName={() => dayClassName}
					minDate={new Date()}
					disabledKeyboardNavigation
					inline
					selectsRange
					swapRange
				/>
			)}
		</div>
	);
};

export default Datepicker;
