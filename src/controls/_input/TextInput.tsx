import './TextInput.css';
import clsx from 'clsx';
import type { TValidationResult } from './types/TValidationResult';
import { useRef, useState } from 'react';
import type { TValidator } from './types/TValidator';

interface ITextInputProps {
	placeholder?: string;
	type: React.HTMLInputTypeAttribute;
	value: string;
	validators?: TValidator<string>[];
	hint?: string;
	invalidHintDuration?: number;
	validateOnFocusOut?: boolean;
	validateOnChange?: boolean;

	onValueChanged?: (value: string) => void;
	onValidationComplete?: (result: TValidationResult) => void;
	onFocusIn?: () => void;
	onFocusOut?: () => void;
}

/**
 * Время (в мс) на протяжении которого над полем ввода вместо подсказки отображается сообщение ошибки валидации
 */
const DEFAULT_INVALID_HINT_DURATION = 3000;

/**
 * Время "дребезга" между окончанием ввода пользователя и валидацией (при условии возведения флага "validateOnChange"),
 * если за это время повторно вызвать изменение значения таймер дребезга обнулится и запустить отложенную валидацию вновь.
 */
const VALIDATION_DEBOUNCE = 700;

const TextInput = ({
	placeholder,
	type,
	value,
	validators,
	hint: defaultHint,
	invalidHintDuration,
	validateOnFocusOut = false,
	validateOnChange = false,
	onValueChanged,
	onValidationComplete,
	onFocusIn,
	onFocusOut,
}: ITextInputProps) => {
	const [validationDebounceTimer, setValidationDebounceTimer] = useState<number | null>(null);
	const [validationCleanerTimer, setValidationCleanerTimer] = useState<number | null>(null);
	const [hint, setHint] = useState(defaultHint);
	const [valid, setValid] = useState(true);

	const inputRef = useRef<HTMLInputElement>(null);

	const rootClassName = clsx(
		'controls-textInput',
		'controls-fontsize-20',
		valid ? 'controls-textInput_valid' : 'controls-textInput_invalid'
	);
	const inputClassName = clsx('controls-textInput__input');
	const hintClassName = clsx(
		'controls-textInput__hint',
		'controls-fontsize-12',
		'controls-fontweight-medium'
	);

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

	const validate = (valueToValidate: string) => {
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
				return;
			}
		}

		onValidationComplete?.(true);
		clearValidationStatus();
	};

	const focusInHandler = () => {
		inputRef.current?.select();
		onFocusIn?.();
	};

	const focusOutHandler = () => {
		onFocusOut?.();
		if (validateOnFocusOut) {
			validate(value);
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
		console.log(newValue);
		onValueChanged?.(newValue);

		if (validateOnChange) {
			clearValidationStatus();
			validateOnInputCompleted(newValue);
		}
	};

	return (
		<div className={rootClassName}>
			<span className={hintClassName}>{hint}</span>
			<input
				ref={inputRef}
				type={type}
				className={inputClassName}
				placeholder={placeholder}
				value={value}
				onChange={changeHandler}
				onBlur={focusOutHandler}
				onFocus={focusInHandler}
			/>
		</div>
	);
};

export default TextInput;
