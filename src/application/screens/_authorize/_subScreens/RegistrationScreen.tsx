import { useRef, useState, type SyntheticEvent } from 'react';
import { isRequired } from '../../../../controls/_input/validators/isRequired';
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
import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { auth, db } from '../../../../../firebase';
import { UserAtom, type IUserAtom } from '../../../core/state/UserAtom';
import { doc, setDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { isValidEmail } from '../../../../controls/_input/validators/isValidEmail';
import { useLoading } from '../../../core/utils/useLoading';
import { toast } from 'react-toastify';

const EMAIL_VALIDATORS = [isRequired, isValidEmail];
const TELEGRAM_VALIDATORS = [isValidTelegarmNickname];
const LICENCE_PLATE_VALIDATORS = [isRequired, isLicensePlate];
const PASSWORD_VALIDATORS = [isRequired, isValidPassword];

const RegistrationSubScreen = ({ className }: IPropsWithClassName) => {
	const [email, setEmail] = useState('');
	const [telegram, setTelegram] = useState('');
	const [licencePlate, setLicencePlate] = useState('');
	const [password, setPassword] = useState('');
	const [passRepeat, setPassRepeat] = useState('');
	const { loading, runProcess } = useLoading();
	const validatorRef = useRef<TValidationAPI>(null);

	const setUserAtom = useSetRecoilState(UserAtom);

	const onSubmitClick = async (event: SyntheticEvent) => {
		event.preventDefault();
		const validateRes = validatorRef.current?.validate();

		if (validateRes) {
			// TODO: отправка зпроса регистрации

			runProcess(() => createUserWithEmailAndPassword(auth, email, password))
				.then((userCredential: UserCredential) =>
					runProcess(() => {
						const user = userCredential.user;

						const dbUser: IUserAtom = {
							email,
							licencePlate: licencePlate.toUpperCase(),
							telegram,
							parkingId: 'parking-1',
							parkingSpotId: null,
						};
						// Создаем запись пользователя в Firestore
						return setDoc(doc(db, 'users', user.uid), dbUser).then(() => {
							setUserAtom(dbUser);
						});
					})
				)
				.catch(() => {
					toast('Не удалось зарегистрироваться!', {
						type: 'error',
						autoClose: 2500,
					});
				});
		}
	};

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
					value={email}
					validators={EMAIL_VALIDATORS}
					validateOnChange
					validateOnFocusOut
					showRequired
					onValueChanged={setEmail}
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
					uppercase
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
					loading={loading}
				/>
			</ValidationController>
		</>
	);
};

export default RegistrationSubScreen;
