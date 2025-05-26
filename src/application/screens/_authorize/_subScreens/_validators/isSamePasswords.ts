const DEFAULT_FAIL_MESSAGE = 'Пароли должны совпадать!';

export const isSamePassowrds = (value: string, toCompareWith: string) => {
	const same = toCompareWith && value === toCompareWith;

	if (!same) {
		return DEFAULT_FAIL_MESSAGE;
	}

	return true;
};
