import DatePicker from 'react-datepicker';
import './Datepicker.css';
import {
	forwardRef,
	useRef,
	useState,
	type ForwardedRef,
	type RefObject,
	type SyntheticEvent,
} from 'react';
import clsx from 'clsx';
import CalendarHeader from './_header/CalendarHeader';
import Button from '../_button/Button';
import CrossIcon from '../_icons/CrossIcon';

interface IDatepickerProps {
	placeholder?: string;
	startDate: Date | null;
	endDate: Date | null;
	onSelectionComplete?: (startDate: Date | null, endDate: Date | null) => void;
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

/**
 * Возвращает true, если календарь надо открывать вверх. Иначе - false.
 */
const calculateUpsideOpening = (inputRef: RefObject<HTMLDivElement | null>): boolean => {
	const screenHeight = window.screen.height;
	const inputTopOffset = inputRef.current?.getBoundingClientRect().top ?? 0;

	return inputTopOffset > screenHeight / 2;
};

const DEFAULT_PLACEHOLDER = 'Дата не выбрана';

const ROOT_CLASS_NAME = 'controls-datepicker';

const Datepicker = (
	{
		placeholder,
		startDate: initialStartDate,
		endDate: initialEndDate,
		onSelectionComplete,
	}: IDatepickerProps,
	rootRef: ForwardedRef<HTMLDivElement>
) => {
	const [startDate, setStartDate] = useState<Date | null>(() => initialStartDate);
	const [endDate, setEndDate] = useState<Date | null>(() => initialEndDate);
	const [openCalendarUpside, setOpenCalendarUpside] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef<HTMLDivElement>(null);

	const calendarClassName = clsx(
		'controls-datepicker__calendar',
		openCalendarUpside
			? 'controls-datepicker__calendar_upside'
			: 'controls-datepicker__calendar_downside'
	);
	const dayClassName = clsx('controls-datepicker__day');
	const dateCardClassName = clsx('controls-datepicker__dateCard', 'controls-fontsize-20');
	const overlayClassName = clsx('controls-datepicker__overlay');

	const rootClickHandler = () => {
		setOpenCalendarUpside(() => calculateUpsideOpening(inputRef));
		setIsOpen(() => true);
	};

	const changeHandler = (value: [Date | null, Date | null]) => {
		setStartDate(() => value[0]);
		setEndDate(() => value[1]);
	};

	const onOverlayClick = () => {
		setIsOpen(() => false);
		onSelectionComplete?.(startDate, endDate);
	};

	const onResetClick = (e: SyntheticEvent) => {
		e.stopPropagation();
		setStartDate(() => null);
		setEndDate(() => null);

		if (!isOpen) {
			onSelectionComplete?.(null, null);
		}
	};

	const title = getChosenDates(startDate, endDate);

	return (
		<div
			ref={rootRef}
			className={ROOT_CLASS_NAME}
		>
			{isOpen && (
				<div
					className={overlayClassName}
					onClick={onOverlayClick}
				/>
			)}
			<div
				ref={inputRef}
				className={dateCardClassName}
				onClick={rootClickHandler}
			>
				<span
					className={clsx(
						!title && 'controls-datepicker__placeholder',
						title && 'controls-datepicker__dateCardTitle'
					)}
				>
					{title !== '' ? title : placeholder || DEFAULT_PLACEHOLDER}
				</span>
				{title && (
					<Button
						className={clsx('controls-datepicker__reset')}
						icon={<CrossIcon size={24} />}
						onClick={onResetClick}
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

export default forwardRef(Datepicker);
