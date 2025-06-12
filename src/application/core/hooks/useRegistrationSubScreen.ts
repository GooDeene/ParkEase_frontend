import { useRef, useState, type SyntheticEvent } from 'react';
import { useLoading } from '../utils/useLoading';
import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { auth, db } from '../../../../firebase';
import type { TValidationAPI } from '../../../controls/_input/types/TValidationAPI';
import { UserAtom, type IUserAtom } from '../state/UserAtom';

type TFormKey = 'email' | 'telegram' | 'licencePlate' | 'password' | 'passRepeat' | 'fullName';

type TRegistrationFormState = {
	[K in TFormKey]: string;
};

const getemptyState = (): TRegistrationFormState => {
	return {
		email: '',
		telegram: '',
		licencePlate: '',
		password: '',
		passRepeat: '',
		fullName: '',
	};
};

export const useRegistrationSubScreen = () => {
	// Состояние полей формы
	const [formState, setFormState] = useState<TRegistrationFormState>(getemptyState());
	// Хук отслеживания выполнения асинхронного запроса
	const { loading, runProcess } = useLoading();
	// Ссылка на контроллер валидации
	const validatorRef = useRef<TValidationAPI>(null);

	const setUserAtom = useSetRecoilState(UserAtom);

	/**
	 * Обработчик смены состояниф формы
	 * @param value Новое значение
	 * @param type Поле формы, которое необходимо записать
	 */
	const onFormChanged = (
		value: TRegistrationFormState[keyof TRegistrationFormState],
		type: TFormKey
	) => {
		setFormState((prev) => {
			return {
				...prev,
				[type]: value,
			};
		});
	};

	/**
	 * Функция обработки клика по кнопке "Зарегистрироваться"
	 */
	const onSubmitClick = (event: SyntheticEvent) => {
		event.preventDefault();
		const validateResult = validatorRef.current?.validate();

		if (validateResult === true) {
			runProcess(() =>
				// отправка зпроса регистрации
				createUserWithEmailAndPassword(auth, formState.email, formState.password)
					.then((userCredential: UserCredential) => {
						const user = userCredential.user;

						const dbUser: IUserAtom = {
							email: formState.email,
							fullName: formState.fullName,
							licencePlate: formState.licencePlate.toUpperCase(),
							telegram: formState.telegram,
							parkingId: null,
						};
						// создаем запись пользователя в Firestore
						return setDoc(doc(db, 'users', user.uid), dbUser);
					})
					.then(() => {
						setUserAtom({
							email: formState.email,
							fullName: formState.fullName,
							licencePlate: formState.licencePlate.toUpperCase(),
							telegram: formState.telegram,
							parkingId: null,
						});
					})
					.catch(() => {
						toast('Не удалось зарегистрироваться!', {
							type: 'error',
							autoClose: 2500,
						});
					})
			);
		}
	};

	return {
		validatorRef,
		formState,
		loading,
		onFormChanged,
		onSubmitClick,
	};
};
