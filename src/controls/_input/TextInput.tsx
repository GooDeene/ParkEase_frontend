import './TextInput.css';
import clsx from 'clsx';
import type { TValidationResult } from './types/TValidationResult';
import { forwardRef, useImperativeHandle, useRef, useState, type ForwardedRef } from 'react';
import type { TValidator } from './types/TValidator';
import type { TValidationAPI } from './types/TValidationAPI';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';

interface ITextInputProps extends IPropsWithClassName {
	placeholder?: string;
	type: React.HTMLInputTypeAttribute;
	value: string;
	validators?: TValidator<string>[];
	hint?: string;
	invalidHintDuration?: number;
	validateOnFocusOut?: boolean;
	validateOnChange?: boolean;
	uppercase?: boolean;
	showRequired?: boolean;
	disabled?: boolean;

	onValueChanged?: (value: string) => void;
	onValidationComplete?: (result: TValidationResult) => void;
	onFocusIn?: () => void;
	onFocusOut?: () => void;
}

export type TInputAPI = TValidationAPI & {
	/**
	 * Устанавливает временное сообщение ошибки для поля ввода по аналогии с текстом ошибки валидации.
	 */
	setTemporalError: (text: string) => void;
};

/**
 * Время (в мс) на протяжении которого над полем ввода вместо подсказки отображается сообщение ошибки валидации
 */
const DEFAULT_INVALID_HINT_DURATION = 3300;

/**
 * Время "дребезга" между окончанием ввода пользователя и валидацией (при условии возведения флага "validateOnChange"),
 * если за это время повторно вызвать изменение значения таймер дребезга обнулится и запустить отложенную валидацию вновь.
 */
const VALIDATION_DEBOUNCE = 700;

const ROOT_CLASS_NAME = 'controls-textInput';

const TextInput = (
	{
		className,
		placeholder,
		type,
		value,
		validators,
		hint: defaultHint,
		invalidHintDuration,
		validateOnFocusOut = false,
		validateOnChange = false,
		uppercase = false,
		showRequired = false,
		disabled = false,
		onValueChanged,
		onValidationComplete,
		onFocusIn,
		onFocusOut,
	}: ITextInputProps,
	ref: ForwardedRef<TInputAPI>
) => {
	const [validationDebounceTimer, setValidationDebounceTimer] = useState<NodeJS.Timeout | null>(
		null
	);
	const [validationCleanerTimer, setValidationCleanerTimer] = useState<NodeJS.Timeout | null>(
		null
	);
	const [hint, setHint] = useState(defaultHint);
	const [valid, setValid] = useState(true);
	const [internalValue, setInternalValue] = useState(value);

	useImperativeHandle(ref, () => {
		return {
			validate: () => validate(internalValue),
			setTemporalError: validationFail,
		};
	});

	const inputRef = useRef<HTMLInputElement>(null);

	const rootClassName = clsx(
		ROOT_CLASS_NAME,
		'controls-fontsize-20',
		valid ? `${ROOT_CLASS_NAME}_valid` : `${ROOT_CLASS_NAME}_invalid`,
		className
	);
	const inputClassName = clsx(
		`${ROOT_CLASS_NAME}__input`,
		uppercase && internalValue !== '' && `${ROOT_CLASS_NAME}__input_uppercase`
	);
	const hintClassName = clsx(
		`${ROOT_CLASS_NAME}__hint`,
		'controls-fontsize-14',
		'controls-fontweight-medium'
	);
	const requiredClassName = clsx(`${ROOT_CLASS_NAME}__required`);

	const validationFail = (message: string) => {
		setHint(() => message);
		setValid(() => false);
		if (validationCleanerTimer) {
			clearTimeout(validationCleanerTimer);
		}

		const timerId = setTimeout(
			() => {
				clearValidationStatus();
			},
			invalidHintDuration === undefined ? DEFAULT_INVALID_HINT_DURATION : invalidHintDuration
		);

		setValidationCleanerTimer(() => timerId);
	};

	const validate = (valueToValidate: string): boolean | string => {
		const validationResult: TValidationResult[] = [];
		for (const validator of validators || []) {
			validationResult.push(validator(valueToValidate));
		}

		for (const result of validationResult) {
			if (typeof result === 'string') {
				onValidationComplete?.(result);
				if (valid || hint !== result) {
					validationFail(result);
				}
				return result;
			}
		}

		onValidationComplete?.(true);
		clearValidationStatus();
		return true;
	};

	const focusInHandler = () => {
		inputRef.current?.select();
		onFocusIn?.();
	};

	const focusOutHandler = () => {
		onFocusOut?.();
		if (validateOnFocusOut) {
			validate(internalValue);
		}
	};

	const validateOnInputCompleted = (newValue: string) => {
		if (validationDebounceTimer) {
			clearTimeout(validationDebounceTimer);
		}

		const timerId = setTimeout(() => {
			validate(newValue);
		}, VALIDATION_DEBOUNCE);

		setValidationDebounceTimer(() => timerId);
	};

	const clearValidationStatus = () => {
		setValid(() => true);
		setHint(() => defaultHint);
	};

	const changeHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = target.value;
		setInternalValue(() => newValue);
		onValueChanged?.(newValue);

		if (validateOnChange) {
			clearValidationStatus();
			validateOnInputCompleted(newValue);
		}
	};

	return (
		<div className={rootClassName}>
			<div className={hintClassName}>
				{showRequired && <span className={requiredClassName}>*</span>}
				<span>{hint}</span>
			</div>
			<input
				disabled={disabled}
				ref={inputRef}
				type={type}
				className={inputClassName}
				placeholder={placeholder}
				value={internalValue}
				onChange={changeHandler}
				onBlur={focusOutHandler}
				onFocus={focusInHandler}
				size={10}
			/>
		</div>
	);
};

export default forwardRef(TextInput);
