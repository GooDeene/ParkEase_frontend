import { useRef, useState } from 'react';
import { isRequired } from '../../../../controls/_input/validators/isRequired';
import { isValidRussianPhone } from '../../../../controls/_input/validators/isValidRussianPhone';
import { isValidPassword } from '../../../../controls/_input/validators/isValidPassword';
import TextInput from '../../../../controls/_input/TextInput';
import { isLicensePlate } from '../../../../controls/_input/validators/isLicensePlate';
import Button from '../../../../controls/_button/Button';
import { isValidTelegarmNickname } from '../../../../controls/_input/validators/isValidTelegamNickname';
import ValidationController from '../../../../controls/_validationController/ValidationController';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import clsx from 'clsx';
import type { TValidationAPI } from '../../../../controls/_input/types/TValidationAPI';
import { isSamePassowrds } from './_validators/isSamePasswords';

const PHONE_VALIDATORS = [isRequired, isValidRussianPhone];
const TELEGRAM_VALIDATORS = [isValidTelegarmNickname];
const LICENCE_PLATE_VALIDATORS = [isRequired, isLicensePlate];
const PASSWORD_VALIDATORS = [isRequired, isValidPassword];

const RegistrationScreen = ({ className }: IPropsWithClassName) => {
	const [phone, setPhone] = useState('');
	const [telegram, setTelegram] = useState('');
	const [licencePlate, setLicencePlate] = useState('');
	const [password, setPassword] = useState('');
	const [passRepeat, setPassRepeat] = useState('');

	const validatorRef = useRef<TValidationAPI>(null);

	const onSubmitClick = () => {
		const validateRes = validatorRef.current?.validate();

		if (validateRes) {
			// TODO: отправка зпроса регистрации
		}
	};

	return (
		<>
			<ValidationController
				childProps={{ className }}
				ref={validatorRef}
			>
				<TextInput
					type='tel'
					hint='Телефон'
					placeholder='Номер, начиная с +7 или 8'
					value={phone}
					validators={PHONE_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={setPhone}
				/>
				<TextInput
					type='text'
					hint='Ник в телеграм'
					placeholder='Начиная с @'
					value={telegram}
					validators={TELEGRAM_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					onValueChanged={setTelegram}
				/>
				<TextInput
					type='text'
					hint='Гос. номер авто'
					placeholder='В формате А123ВС777'
					value={licencePlate}
					validators={LICENCE_PLATE_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={setLicencePlate}
				/>
				<TextInput
					type='password'
					hint='Пароль'
					value={password}
					validators={PASSWORD_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={setPassword}
				/>
				<TextInput
					type='password'
					hint='Повторите пароль'
					value={passRepeat}
					validators={[(value) => isSamePassowrds(value, password)]}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={setPassRepeat}
				/>
				<Button
					className={clsx('controls-margin_top-3xl', className)}
					title='Зарегистрироваться'
					onClick={onSubmitClick}
				/>
			</ValidationController>
		</>
	);
};

export default RegistrationScreen;
