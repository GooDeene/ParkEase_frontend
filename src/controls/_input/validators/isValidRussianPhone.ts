import type { TValidator } from '../types/TValidator';

const SIMPLE_RUSSIAN_PHONE_REGEXP = /^(8|\+7|7)9\d{9}$/;
const DEFAULT_FAIL_MESSAGE = 'Телефон введён некорректно!';

export const isValidRussianPhone: TValidator<string> = (value) => {
	const trimmed = value.trim();

	if (!SIMPLE_RUSSIAN_PHONE_REGEXP.test(trimmed)) {
		return DEFAULT_FAIL_MESSAGE;
	}

	return true;
};
