import type { TValidator } from '../types/TValidator';

const NICKNAME_SYMBOL = '@';
const DEFAULT_FAIL_MESSAGE = 'Ник должен начинаться с @';
const NOT_EMPTY_NICKNAME = 'Ник не может быть пустым';

export const isValidTelegarmNickname: TValidator<string> = (value) => {
	const trimmed = value.trim();

	if (trimmed.length && trimmed.charAt(0) !== NICKNAME_SYMBOL) {
		return DEFAULT_FAIL_MESSAGE;
	} else if (trimmed.length && !trimmed.replace('@', '').length) {
		return NOT_EMPTY_NICKNAME;
	}

	return true;
};
