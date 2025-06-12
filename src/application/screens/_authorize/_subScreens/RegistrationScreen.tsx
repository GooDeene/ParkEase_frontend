import { isRequired } from '../../../../controls/_input/validators/isRequired';
import { isValidPassword } from '../../../../controls/_input/validators/isValidPassword';
import TextInput from '../../../../controls/_input/TextInput';
import { isLicensePlate } from '../../../../controls/_input/validators/isLicensePlate';
import Button from '../../../../controls/_button/Button';
import { isValidTelegarmNickname } from '../../../../controls/_input/validators/isValidTelegamNickname';
import ValidationController from '../../../../controls/_validationController/ValidationController';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import clsx from 'clsx';
import { isSamePassowrds } from './_validators/isSamePasswords';
import { isValidEmail } from '../../../../controls/_input/validators/isValidEmail';
import { useRegistrationSubScreen } from '../../../core/hooks/useRegistrationSubScreen';

const EMAIL_VALIDATORS = [isRequired, isValidEmail];
const TELEGRAM_VALIDATORS = [isValidTelegarmNickname];
const LICENCE_PLATE_VALIDATORS = [isRequired, isLicensePlate];
const PASSWORD_VALIDATORS = [isRequired, isValidPassword];
const FULL_NAME_VALIDATORS = [isRequired];

const RegistrationSubScreen = ({ className }: IPropsWithClassName) => {
	const { validatorRef, formState, onFormChanged, onSubmitClick, loading } =
		useRegistrationSubScreen();

	return (
		<>
			<ValidationController
				childProps={{ className }}
				ref={validatorRef}
			>
				<TextInput
					type='email'
					hint='Почта'
					placeholder='ex@ample.com'
					value={formState.email}
					validators={EMAIL_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={(val) => onFormChanged(val, 'email')}
				/>
				<TextInput
					type='text'
					hint='Фамилия и имя'
					placeholder='Иванов Иван'
					value={formState.fullName}
					validators={FULL_NAME_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={(val) => onFormChanged(val, 'fullName')}
				/>
				<TextInput
					type='text'
					hint='Ник в телеграм'
					placeholder='Начиная с @'
					value={formState.telegram}
					validators={TELEGRAM_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					onValueChanged={(val) => onFormChanged(val, 'telegram')}
				/>
				<TextInput
					type='text'
					hint='Гос. номер авто'
					placeholder='В формате А123ВС777'
					value={formState.licencePlate}
					validators={LICENCE_PLATE_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					uppercase
					onValueChanged={(val) => onFormChanged(val, 'licencePlate')}
				/>
				<div className={clsx('authorizeScreen__separator', className)} />
				<TextInput
					type='password'
					hint='Пароль'
					value={formState.password}
					validators={PASSWORD_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={(val) => onFormChanged(val, 'password')}
				/>
				<TextInput
					type='password'
					hint='Повторите пароль'
					value={formState.passRepeat}
					validators={[(value) => isSamePassowrds(value, formState.password)]}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={(val) => onFormChanged(val, 'passRepeat')}
				/>
				<Button
					className={clsx('controls-margin_top-3xl', className)}
					title='Зарегистрироваться'
					onClick={onSubmitClick}
					loading={loading}
				/>
			</ValidationController>
		</>
	);
};

export default RegistrationSubScreen;
