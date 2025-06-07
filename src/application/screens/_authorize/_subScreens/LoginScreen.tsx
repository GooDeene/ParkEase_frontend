import { useRef, useState } from 'react';
import { isRequired } from '../../../../controls/_input/validators/isRequired';
import TextInput, { type TInputAPI } from '../../../../controls/_input/TextInput';
import Button from '../../../../controls/_button/Button';
import ValidationController from '../../../../controls/_validationController/ValidationController';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import clsx from 'clsx';
import type { TValidationAPI } from '../../../../controls/_input/types/TValidationAPI';
import { signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { auth } from '../../../../../firebase';
import { toast } from 'react-toastify';
import { useLoading } from '../../../core/utils/useLoading';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';
import { AuthAtom } from '../../../core/state/AuthAtom';

const EMAIL_VALIDATORS = [isRequired];
const PASSWORD_VALIDATORS = [isRequired];

const LOGIN_FAILED_MESSAGE = 'Неверный логин или пароль!';

const LoginSubScreen = ({ className }: IPropsWithClassName) => {
	const navigate = useNavigate();
	const setAuthAtom = useSetRecoilState(AuthAtom);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { loading, runProcess } = useLoading();

	const emailInputRef = useRef<TInputAPI>(null);
	const passwordInputRef = useRef<TInputAPI>(null);

	const validatorRef = useRef<TValidationAPI>(null);

	const onSubmitClick = () => {
		const validateRes = validatorRef.current?.validate();

		if (validateRes) {
			runProcess(() => signInWithEmailAndPassword(auth, email, password))
				.then((user: UserCredential) => {
					if (user) {
						setAuthAtom({ logged: true, role: 'user' });
						navigate('/main');
					}
				})
				.catch(() => {
					console.log('Ошибка авторизации!');
					emailInputRef.current?.setTemporalError(LOGIN_FAILED_MESSAGE);
					passwordInputRef.current?.setTemporalError(LOGIN_FAILED_MESSAGE);
					toast(`Ошибка авторизации!`, {
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
					ref={emailInputRef}
					type='email'
					hint='Почта'
					placeholder='ex@ample.com'
					value={email}
					validateOnChange
					validateOnFocusOut
					validators={EMAIL_VALIDATORS}
					onValueChanged={setEmail}
				/>
				<TextInput
					ref={passwordInputRef}
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
					loading={loading}
					onClick={onSubmitClick}
				/>
			</ValidationController>
		</>
	);
};

export default LoginSubScreen;
