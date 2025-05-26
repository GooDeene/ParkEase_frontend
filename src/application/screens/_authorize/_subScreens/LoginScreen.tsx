import { useRef, useState } from 'react';
import { isRequired } from '../../../../controls/_input/validators/isRequired';
import { isValidRussianPhone } from '../../../../controls/_input/validators/isValidRussianPhone';
import TextInput from '../../../../controls/_input/TextInput';
import Button from '../../../../controls/_button/Button';
import ValidationController from '../../../../controls/_validationController/ValidationController';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import clsx from 'clsx';
import type { TValidationAPI } from '../../../../controls/_input/types/TValidationAPI';

const PHONE_VALIDATORS = [isRequired, isValidRussianPhone];
const PASSWORD_VALIDATORS = [isRequired];

const LoginScreen = ({ className }: IPropsWithClassName) => {
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');

	const validatorRef = useRef<TValidationAPI>(null);

	const onSubmitClick = () => {
		const validateRes = validatorRef.current?.validate();

		if (validateRes) {
			// TODO: отправка зпроса авторизации
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
					validateOnChange
					validateOnFocusOut
					validators={PHONE_VALIDATORS}
					onValueChanged={setPhone}
				/>
				<TextInput
					type='password'
					hint='Пароль'
					value={password}
					validateOnChange
					validateOnFocusOut
					validators={PASSWORD_VALIDATORS}
					onValueChanged={setPassword}
				/>
				<Button
					className={clsx('controls-margin_top-3xl', className)}
					title='Войти'
					onClick={onSubmitClick}
				/>
			</ValidationController>
		</>
	);
};

export default LoginScreen;
