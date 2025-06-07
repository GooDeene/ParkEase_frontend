import clsx from 'clsx';
import './ParkingSelectionScreen.css';
import Logo from '/src/assets/logo_high_res.png';
import { useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react';
import ValidationController from '../../../controls/_validationController/ValidationController';
import TextInput, { type TInputAPI } from '../../../controls/_input/TextInput';
import type { TValidationAPI } from '../../../controls/_input/types/TValidationAPI';
import { isRequired } from '../../../controls/_input/validators/isRequired';
import Button from '../../../controls/_button/Button';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useLoading } from '../../core/utils/useLoading';
import { auth, db } from '../../../../firebase';
import { toast } from 'react-toastify';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { AuthAtom } from '../../core/state/AuthAtom';
import { Link } from 'react-router';
import { signOut } from 'firebase/auth';
import { UserAtom } from '../../core/state/UserAtom';

const ROOT_CLASS_NAME = 'parkingSelectionScreen';
const HINT_BLOCK_CLASS_NAME = `${ROOT_CLASS_NAME}__hintBlock`;
const DATA_BLOCK_CLASS_NAME = `${ROOT_CLASS_NAME}__dataBlock`;

const HINT = {
	title: 'Вы не прикреплены ни к одной к парковке',
	detail: 'Чтобы начать использовать приложение, введите код приглашения на парковку, полученный от администратора вашего офиса',
};
const PARKING_CPNNECTION_ERROR_MESSAGE = 'Такой парковки не существует!';

const CODE_VALIDATORS = [isRequired];

const ParkingSelectionScreen = () => {
	const [code, setCode] = useState('');
	const validatorRef = useRef<TValidationAPI>(null);
	const parkingCodeInputRef = useRef<TInputAPI>(null);
	const { loading, runProcess } = useLoading();
	const authAtom = useRecoilValue(AuthAtom);
	// const setUserAtom = useSetRecoilState(UserAtom);
	const resetUserAtom = useResetRecoilState(UserAtom);
	const resetAuthAtom = useResetRecoilState(AuthAtom);

	const logoClassName = clsx(`${ROOT_CLASS_NAME}__logo`);

	const onSubmitClick = (event: SyntheticEvent) => {
		event.preventDefault();
		const isValid = validatorRef.current?.validate();

		isValid &&
			runProcess(() => {
				return getDoc(doc(db, 'parkings', code))
					.then((parkingSnap) => {
						if (parkingSnap.exists() && auth.currentUser) {
							return setDoc(
								doc(db, 'users', auth.currentUser.uid),
								{ parkingId: code },
								{ merge: true }
							);
						} else {
							parkingCodeInputRef.current?.setTemporalError(
								PARKING_CPNNECTION_ERROR_MESSAGE
							);
							toast(`Ошибка подлючения к парковке!`, {
								type: 'error',
								autoClose: 2500,
							});
						}
					})
					.catch(() => {
						toast(`Ошибка выполнения запроса! Повторите запрос позднее!`, {
							type: 'error',
							autoClose: 2500,
						});
					});
			});
	};

	const onLogoutClick = () => {
		signOut(auth)
			.then(() => {
				resetUserAtom();
				resetAuthAtom();
			})
			.catch(() => {
				console.log('Ошибка разлогинивания!');
			});
	};

	useLayoutEffect(() => {
		const body = document.querySelector('body');
		if (body) {
			body.style.backgroundImage = `url('/background.png')`;
		}

		return () => {
			if (body) {
				body.style.backgroundImage = ``;
			}
		};
	}, []);

	return (
		<ScreenLayout>
			<div className={ROOT_CLASS_NAME}>
				<img
					width={100}
					height={100}
					className={logoClassName}
					src={Logo}
				/>
				<div className={HINT_BLOCK_CLASS_NAME}>
					<span
						className={clsx(
							'controls-fontcolor-main',
							'controls-fontsize-24',
							'controls-fontweight-medium'
						)}
					>
						{HINT.title}
					</span>
					<span
						className={clsx(
							'controls-fontcolor-hint',
							'controls-fontsize-16',
							'controls-fontweight-medium'
						)}
					>
						{HINT.detail}
					</span>
				</div>
				<div className={DATA_BLOCK_CLASS_NAME}>
					<ValidationController ref={validatorRef}>
						<TextInput
							ref={parkingCodeInputRef}
							type='text'
							hint='Код приглашения'
							value={code}
							validateOnChange
							validateOnFocusOut
							validators={CODE_VALIDATORS}
							onValueChanged={setCode}
						/>
						<Button
							className={clsx('controls-margin_top-4xl')}
							title='Вступить'
							loading={loading}
							onClick={onSubmitClick}
							disabled={!authAtom.logged}
						/>
						<Link
							to=''
							onClick={onLogoutClick}
						>
							Выйти из аккаунта
						</Link>
					</ValidationController>
				</div>
			</div>
		</ScreenLayout>
	);
};

export default ParkingSelectionScreen;
