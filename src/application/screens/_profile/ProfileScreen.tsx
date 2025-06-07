import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Title from '../../../controls/_title/Title';
import TextInput from '../../../controls/_input/TextInput';
import { memo, useRef, useState } from 'react';
import { isLicensePlate } from '../../../controls/_input/validators/isLicensePlate';
import { isRequired } from '../../../controls/_input/validators/isRequired';
import Button from '../../../controls/_button/Button';
import { isValidTelegarmNickname } from '../../../controls/_input/validators/isValidTelegamNickname';
import './ProfileScreen.css';
import ValidationController from '../../../controls/_validationController/ValidationController';
import type { TValidationAPI } from '../../../controls/_input/types/TValidationAPI';
import { useRecoilState } from 'recoil';
import { UserAtom } from '../../core/state/UserAtom';
import { isValidEmail } from '../../../controls/_input/validators/isValidEmail';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';
import { useLoading } from '../../core/utils/useLoading';
import { toast } from 'react-toastify';

type TInputVariant = 'fullName' | 'email' | 'licencePlate' | 'telegram';

const ROOT_CLASS_NAME = 'profileScreen';

const FULL_NAME_VALIDATORS = [isRequired];
const EMAIL_VALIDATORS = [isRequired, isValidEmail];
const LICENCE_PLATE_VALIDATORS = [isRequired, isLicensePlate];
const TELEGRAM_VALIDATORS = [isValidTelegarmNickname];

const ProfileScreen = () => {
	const [userAtom, _setUserAtom] = useRecoilState(UserAtom);

	const [fullName, setFullName] = useState<string>(userAtom.fullName || '');
	const [email, setEmail] = useState<string>(userAtom.email || '');
	const [licencePlate, setLicencePlate] = useState<string>(userAtom.licencePlate || '');
	const [telegram, setTelegram] = useState<string>(userAtom.telegram || '');
	const [isButtonActive, setIsButtonActive] = useState(false);
	const validatorRef = useRef<TValidationAPI>(null);

	const { loading, runProcess } = useLoading();

	const inputsClassName = clsx(`${ROOT_CLASS_NAME}__inputs`, 'controls-margin_top-l');
	const submitButtonClassName = clsx(`${ROOT_CLASS_NAME}__submitButton`);

	const onInputChange = (value: string, type: TInputVariant) => {
		setIsButtonActive(() => userAtom[type] !== value);
		switch (type) {
			case 'fullName':
				setFullName(() => value);
				break;
			case 'email':
				setEmail(() => value);
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
			runProcess(() =>
				updateDoc(doc(db, 'users', auth.currentUser?.uid || ''), {
					fullName,
					licencePlate,
					telegram,
				})
			)
				.then(() => {
					toast('Данные профиля обновлены!', {
						type: 'success',
						autoClose: 2000,
					});
					setIsButtonActive(false);
				})
				.catch(() => {
					toast('Ошибка обновления профиля! Данные не изменены', {
						type: 'error',
						autoClose: 3000,
					});
				});
		}
	};

	return (
		<div>
			<Header showHome />
			<ScreenLayout>
				<Title text='Информация о пользователе' />
				<div className={inputsClassName}>
					<ValidationController ref={validatorRef}>
						<TextInput
							disabled
							hint='Почта'
							type='email'
							placeholder='ex@ample.ru'
							value={email}
							onValueChanged={(val) => onInputChange(val, 'email')}
							validators={EMAIL_VALIDATORS}
							validateOnChange
							validateOnFocusOut
						/>
						<TextInput
							hint='Фамилия и имя'
							type='text'
							placeholder='Иванов Иван'
							value={fullName}
							onValueChanged={(val) => onInputChange(val, 'fullName')}
							validators={FULL_NAME_VALIDATORS}
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
					loading={loading}
				/>
			</ScreenLayout>
		</div>
	);
};

export default memo(ProfileScreen);
