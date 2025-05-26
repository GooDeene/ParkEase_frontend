import type { TValidator } from '../types/TValidator';

const CHECKS = [
	{ regexp: /^.*(?=.{8,}).*$/, message: 'Длина от 8 символов!' },
	{
		regexp: /^.*(?=.*[a-zа-я]).*$/,
		message: 'Хотя бы одна строчная буква!',
	},
	// {
	// 	regexp: /^.*(?=.*[A-ZА-Я]).*$/,
	// 	message: 'Пароль должен содержать хотя бы одну заглвную букву',
	// },
	{
		regexp: /^.*(?=.*\d).*$/,
		message: 'Хотя бы одна цифра!',
	},
];

export const isValidPassword: TValidator<string> = (value) => {
	const trimmed = value.trim();

	for (const check of CHECKS) {
		const res = check.regexp.test(trimmed);
		if (!res) {
			return check.message;
		}
	}

	return true;
};
