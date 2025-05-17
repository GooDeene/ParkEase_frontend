import type { TValidator } from '../types/TValidator';

const LICENSE_PLATE_REGEXP =
	/^[АВЕКМНОРСТУХавекмнорстух]\d{3}(?<!000)[АВЕКМНОРСТУХавекмнорстух]{2}\d{2,3}$/;

const DEFAULT_FAIL_MESSAGE = 'Гос. номер авто не соответствует формату!';

export const isLicensePlate: TValidator<string> = (value) => {
	if (!LICENSE_PLATE_REGEXP.test(value)) {
		return DEFAULT_FAIL_MESSAGE;
	}

	return true;
};
