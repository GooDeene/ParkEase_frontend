import type { TValidator } from '../types/TValidator';

const DEFAULT_FAIL_MESSAGE = 'Поле обязательно для заполнения!';

export const isRequired: TValidator<string> = (value: string, failMessage?: string) => {
	const trimmed = value.trim();

	if (trimmed.length === 0) {
		return failMessage ?? DEFAULT_FAIL_MESSAGE;
	}

	return true;
};
