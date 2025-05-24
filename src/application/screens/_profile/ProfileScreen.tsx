import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Title from '../../../controls/_title/Title';
import TextInput from '../../../controls/_input/TextInput';
import { useRef, useState } from 'react';
import { isValidRussianPhone } from '../../../controls/_input/validators/isValidRussianPhone';
import { isLicensePlate } from '../../../controls/_input/validators/isLicensePlate';
import { isRequired } from '../../../controls/_input/validators/isRequired';
import Button from '../../../controls/_button/Button';
import { isValidTelegarmNickname } from '../../../controls/_input/validators/isValidTelegamNickname';
import './ProfileScreen.css';
import ValidationController from '../../../controls/_validationController/ValidationController';
import type { TValidationAPI } from '../../../controls/_input/types/TValidationAPI';

type TInputVariant = 'phone' | 'licencePlate' | 'telegram';

const ROOT_CLASS_NAME = 'profileScreen';

const PHONE_VALIDATORS = [isRequired, isValidRussianPhone];
const LICENCE_PLATE_VALIDATORS = [isRequired, isLicensePlate];
const TELEGRAM_VALIDATORS = [isValidTelegarmNickname];

const ProfileScreen = ({ defaultValues }: { defaultValues: any }) => {
	const [phone, setPhone] = useState<string>(defaultValues.phone);
	const [licencePlate, setLicencePlate] = useState<string>(defaultValues.licencePlate);
	const [telegram, setTelegram] = useState<string>(defaultValues.telegram);
	const [isButtonActive, setIsButtonActive] = useState(false);
	const validatorRef = useRef<TValidationAPI>(null);

	const inputsClassName = clsx(`${ROOT_CLASS_NAME}__inputs`, 'controls-margin_top-l');
	const submitButtonClassName = clsx(`${ROOT_CLASS_NAME}__submitButton`);

	const onInputChange = (value: string, type: TInputVariant) => {
		setIsButtonActive(() => defaultValues[type] !== value);
		switch (type) {
			case 'phone':
				setPhone(() => value);
				break;
			case 'licencePlate':
				setLicencePlate(() => value);
				break;
			case 'telegram':
				setTelegram(() => value);
				break;
		}
	};

	/**
	 * Обработчик клика кнопки подтверждения изменений.
	 * Вызывает валидацию всего содержимого контейнера, подсвечивая нарушения.
	 * В случае успеха - отправляет запрос к API.
	 * В случае неудачи - ничего не делает
	 */
	const onSubmitClick = () => {
		const validationRes = validatorRef.current?.validate();
		if (validationRes) {
			console.log('ВАЛИДАЦИЯ УСПЕШНА МОЖНО ДЕЛАТЬ ЗАПРОС');
		} else {
			console.log('ЧТО-ТО НЕ ТАК!');
		}
	};

	return (
		<div>
			<Header />
			<ScreenLayout>
				<Title text='Информация о пользователе' />
				<div className={inputsClassName}>
					<ValidationController ref={validatorRef}>
						<TextInput
							hint='Телефон'
							type='tel'
							placeholder='Номер, начиная с +7 или 8'
							value={phone}
							onValueChanged={(val) => onInputChange(val, 'phone')}
							validators={PHONE_VALIDATORS}
							validateOnChange
							validateOnFocusOut
						/>
						<TextInput
							hint='Гос. номер авто'
							type='text'
							placeholder='В формате A123BC11'
							value={licencePlate}
							onValueChanged={(val) => onInputChange(val, 'licencePlate')}
							validators={LICENCE_PLATE_VALIDATORS}
							validateOnChange
							validateOnFocusOut
						/>
						<TextInput
							hint='Ник в телеграм'
							placeholder='@tg_nickname'
							type='text'
							value={telegram}
							onValueChanged={(val) => onInputChange(val, 'telegram')}
							validators={TELEGRAM_VALIDATORS}
							validateOnChange
							validateOnFocusOut
						/>
					</ValidationController>
				</div>
				<Button
					title='Сохранить'
					className={submitButtonClassName}
					disabled={!isButtonActive}
					onClick={onSubmitClick}
				/>
			</ScreenLayout>
		</div>
	);
};

export default ProfileScreen;
