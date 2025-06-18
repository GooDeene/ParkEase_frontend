import DatePicker from 'react-datepicker';
import './Datepicker.css';
import { forwardRef, useRef, useState, type ForwardedRef, type SyntheticEvent } from 'react';
import clsx from 'clsx';
import CalendarHeader from './_header/CalendarHeader';
import Button from '../_button/Button';
import CrossIcon from '../_icons/CrossIcon';
import { getDatesPeriod } from '../utils/getDatesPeriod';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import { isDatesEqual } from '../utils/isDatesEqual';
import { toast } from 'react-toastify';
import type { TPeriod } from '../../application/screens/_giveUp/GiveUpScreen';

interface IDatepickerProps extends IPropsWithClassName {
	placeholder?: string;
	startDate: Date | null;
	endDate: Date | null;
	// Включает режим постоянного отображения календаря, а не по клику на поле ввода
	inline?: boolean;
	calendarClassName?: string;
	excludeDateIntervals?: TPeriod[];
	includeDateIntervals?: TPeriod[];
	selectRange?: boolean;

	onSelectionComplete?: (startDate: Date | null, endDate: Date | null) => void;
}

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
		excludeDateIntervals,
		includeDateIntervals,
		selectRange = true,
	}: IDatepickerProps,
	rootRef: ForwardedRef<HTMLDivElement>
) => {
	const [startDate, setStartDate] = useState<Date | null>(() => initialStartDate);
	const [endDate, setEndDate] = useState<Date | null>(() => initialEndDate);
	// const [openCalendarUpside, setOpenCalendarUpside] = useState(false);
	const [isOpen, setIsOpen] = useState(inline);

	const inputRef = useRef<HTMLDivElement>(null);

	const calendarClassName = clsx(
		`${ROOT_CLASS_NAME}__calendar`,
		!inline && `${ROOT_CLASS_NAME}__calendar_inputMode`,
		!inline &&
			// (openCalendarUpside
			// 	? `${ROOT_CLASS_NAME}__calendar_upside`
			`${ROOT_CLASS_NAME}__calendar_downside`,
		isOpen ? 'test-class_shown' : 'test-class_hidden',
		calendarClass
	);
	const dayClassName = clsx(`${ROOT_CLASS_NAME}__day`);
	const dateCardClassName = clsx(`${ROOT_CLASS_NAME}__dateCard`, 'controls-fontsize-20');
	const overlayClassName = clsx(`${ROOT_CLASS_NAME}__overlay`);

	const testRef = useRef<DatePicker>(null);

	const rootClickHandler = () => {
		if (!inline) {
			// setOpenCalendarUpside(() => calculateUpsideOpening(inputRef));
			setIsOpen(() => true);

			const el = document.querySelector(`.controls-datepicker__calendar`);
			setTimeout(() => el?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
			// document.body.style.overflow = 'hidden';
		}
	};

	/**
	 * Функция валидации пересечений, запрещающая выбор интервала, подынтервалом которого является выколотый
	 */
	const validateIntersections = (start: Date, end: Date): boolean => {
		if (!excludeDateIntervals) {
			return true;
		}

		for (const interval of excludeDateIntervals) {
			// Если какой-то конец запрещенных интервалов содержится в выбранном промежутке, выбор невалиден
			if (
				(interval.start >= start && interval.start <= end) ||
				(interval.end >= start && interval.end <= end)
			) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Внутренний обработчик смены выбранного значения.
	 * Если значения идентичны - установили период из одной даты.
	 * Тогда представим его не как период, а как фиксированную дату.
	 */
	const changeHandler = (obj: [Date | null, Date | null] | Date) => {
		const [start, end] = obj instanceof Array ? obj : [obj, null];

		if (isDatesEqual(start, end) && start !== null) {
			setStartDate(() => start);
			setEndDate(() => null);

			if (inline) {
				onSelectionComplete?.(start, null);
			}
		} else if (start !== null && end !== null) {
			const isValid = validateIntersections(start, end);
			console.log(`Рез-т валидации: ${isValid}`);
			if (isValid) {
				setStartDate(() => start);
				setEndDate(() => end);

				if (inline) {
					onSelectionComplete?.(start, end);
				}
			} else {
				toast('Нельзя выбрать период с недоступными датами!', {
					type: 'error',
					autoClose: 2300,
				});
				setStartDate(() => null);
				setEndDate(() => null);
				if (inline) {
					onSelectionComplete?.(null, null);
				}
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

		if (!inline) {
			setIsOpen(() => false);
		}
		onSelectionComplete?.(null, null);
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
			<DatePicker
				ref={testRef}
				calendarClassName={calendarClassName}
				// endDate={endDate}
				onChange={changeHandler}
				renderCustomHeader={CalendarHeader}
				dayClassName={() => dayClassName}
				minDate={new Date()}
				excludeDateIntervals={excludeDateIntervals}
				includeDateIntervals={includeDateIntervals}
				disabledKeyboardNavigation
				inline
				swapRange
				// @ts-ignore
				selectsRange={selectRange}
				{...(selectRange ? { startDate, endDate } : { selected: startDate })}
			/>
			{/* )} */}
		</div>
	);
};

export default forwardRef(Datepicker);
