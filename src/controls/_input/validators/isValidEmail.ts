import type { TValidator } from '../types/TValidator';

const SIMPLE_RUSSIAN_PHONE_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
const DEFAULT_FAIL_MESSAGE = 'Почта не по формату!';

export const isValidEmail: TValidator<string> = (value) => {
	const trimmed = value.trim();

	if (!SIMPLE_RUSSIAN_PHONE_REGEXP.test(trimmed)) {
		return DEFAULT_FAIL_MESSAGE;
	}

	return true;
};
