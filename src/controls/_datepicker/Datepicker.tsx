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
import { getDatesPeriod } from '../utils/getDatesPeriod';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import { isDatesEqual } from '../utils/isDatesEqual';

interface IDatepickerProps extends IPropsWithClassName {
	placeholder?: string;
	startDate: Date | null;
	endDate: Date | null;
	// Включает режим постоянного отображения календаря, а не по клику на поле ввода
	inline?: boolean;
	calendarClassName?: string;

	onSelectionComplete?: (startDate: Date | null, endDate: Date | null) => void;
}

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
		inline = false,
		className,
		calendarClassName: calendarClass,
	}: IDatepickerProps,
	rootRef: ForwardedRef<HTMLDivElement>
) => {
	const [startDate, setStartDate] = useState<Date | null>(() => initialStartDate);
	const [endDate, setEndDate] = useState<Date | null>(() => initialEndDate);
	const [openCalendarUpside, setOpenCalendarUpside] = useState(false);
	const [isOpen, setIsOpen] = useState(inline);

	const inputRef = useRef<HTMLDivElement>(null);

	const calendarClassName = clsx(
		`${ROOT_CLASS_NAME}__calendar`,
		!inline && `${ROOT_CLASS_NAME}__calendar_inputMode`,
		!inline &&
			(openCalendarUpside
				? `${ROOT_CLASS_NAME}__calendar_upside`
				: `${ROOT_CLASS_NAME}__calendar_downside`),
		calendarClass
	);
	const dayClassName = clsx(`${ROOT_CLASS_NAME}__day`);
	const dateCardClassName = clsx(`${ROOT_CLASS_NAME}__dateCard`, 'controls-fontsize-20');
	const overlayClassName = clsx(`${ROOT_CLASS_NAME}__overlay`);

	const rootClickHandler = () => {
		if (!inline) {
			setOpenCalendarUpside(() => calculateUpsideOpening(inputRef));
			setIsOpen(() => true);
			// document.body.style.overflow = 'hidden';
		}
	};

	/**
	 * Внутренний обработчик смены выбранного значения.
	 * Если значения идентичны - установили период из одной даты.
	 * Тогда представим его не как период, а как фиксированную дату.
	 */
	const changeHandler = ([start, end]: [Date | null, Date | null]) => {
		if (isDatesEqual(start, end) && start !== null) {
			setStartDate(() => start);
			setEndDate(() => null);

			if (inline) {
				onSelectionComplete?.(start, null);
			}
		} else {
			setStartDate(() => start);
			setEndDate(() => end);

			if (inline) {
				onSelectionComplete?.(start, end);
			}
		}
	};

	const onOverlayClick = () => {
		if (!inline) {
			setIsOpen(() => false);
			document.body.style.overflow = '';
			onSelectionComplete?.(startDate, endDate);
		}
	};

	const onResetClick = (e: SyntheticEvent) => {
		e.stopPropagation();
		setStartDate(() => null);
		setEndDate(() => null);

		if (inline || !isOpen) {
			onSelectionComplete?.(null, null);
		}
	};

	const title = getDatesPeriod([startDate, endDate]);

	return (
		<div
			ref={rootRef}
			className={clsx(ROOT_CLASS_NAME, className)}
		>
			{isOpen && !inline && (
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
						!title && `${ROOT_CLASS_NAME}__placeholder`,
						title && `${ROOT_CLASS_NAME}__dateCardTitle`
					)}
				>
					{title !== '' ? title : placeholder || DEFAULT_PLACEHOLDER}
				</span>
				{title && (
					<Button
						className={clsx(`${ROOT_CLASS_NAME}__reset`)}
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
