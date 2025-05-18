import DatePicker from 'react-datepicker';
import './Datepicker.css';
import { createContext, useState, type SyntheticEvent } from 'react';
import clsx from 'clsx';
import CalendarHeader from './_header/CalendarHeader';
import Button from '../_button/Button';
import { Icon } from '../Constants';

interface IDatepickerProps {}

interface IDatePickerContext {
	useRangeMode: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
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

export const DatepickerContext = createContext<IDatePickerContext | null>(null);

const Cross = () => {
	return (
		<svg
			width='50'
			height='50'
			viewBox='0 0 50 50'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M45 45L5 5M45 5L5 45'
				stroke='currentColor'
				stroke-width='4'
				stroke-linecap='round'
			/>
		</svg>
	);
};

const DEFAULT_PLACEHOLDER = 'Дата не выбрана';

const Datepicker = ({}: IDatepickerProps) => {
	const [startDate, setStartDate] = useState<Date | null>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(new Date());
	const [rangeMode, setRangeMode] = useState(true);
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
		const copy = [...value];

		const start = copy[0];
		const end = copy[1];
		setStartDate(() => start);
		setEndDate(() => end);
		// setIsOpen(() => false);
	};
	const title = getChosenDates(startDate, endDate);

	const renderDayContents = (day: number, _date: Date) => {
		return <div className={dayClassName}>{day}</div>;
	};

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
					<span className='controls-datepicker__placeholder'>{DEFAULT_PLACEHOLDER}</span>
				)}
				{title && (
					<Button
						className={clsx('controls-datepicker__reset', 'controls-margin_right-xs')}
						icon={Icon.cross}
						iconSizes={{ height: 24, width: 24 }}
						onClick={(e: SyntheticEvent) => {
							e.stopPropagation();
							setStartDate(() => null);
							setEndDate(() => null);
						}}
					/>
				)}
			</div>
			{isOpen && rangeMode && (
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
					// renderDayContents={renderDayContents}
				/>
			)}
		</div>
	);
};

export default Datepicker;
