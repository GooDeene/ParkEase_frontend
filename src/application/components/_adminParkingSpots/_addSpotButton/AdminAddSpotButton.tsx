import clsx from 'clsx';
import type { IAdminParkingSpot } from '../_registry/AdminParkingSpotsRegistry';
import './AdminAddSpotButton.css';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../../controls/_button/Button';
import CrossCircleIcon from '../../../../controls/_icons/CrossCircleIcon';
import CommitIcon from '../../../../controls/_icons/CommitIcon';
import { useLoading } from '../../../core/utils/useLoading';

import LoaderGif from '/menu_spinner_dark.gif';
import { useRecoilValue } from 'recoil';
import { UserAtom } from '../../../core/state/UserAtom';
import { AuthAtom } from '../../../core/state/AuthAtom';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { useNavigate } from 'react-router';

interface IAdminAddSpotButtonProps {
	items: IAdminParkingSpot[];
	setItems: React.Dispatch<React.SetStateAction<IAdminParkingSpot[]>>;
}

const ROOT_CLASS_NAME = 'adminAddSpotButton';
const DEFAULT_STATIC_SYMBOL = '+';

const DEFAULT_VALIDATION_FAIL_MESSAGE = 'Место уже существует!';
const DEFAULT_EMPTY_NAME_MESSAGE = 'Место не может быть с пустым названием!';

const AdminAddSpotButton = ({ items, setItems }: IAdminAddSpotButtonProps) => {
	const navigate = useNavigate();

	const userAtom = useRecoilValue(UserAtom);
	const authAtom = useRecoilValue(AuthAtom);

	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState<string>('');
	const [isInvalid, setIsInvalid] = useState(false);
	const [invalidTimer, setInvalidTimer] = useState<NodeJS.Timeout | null>(null);

	const { loading, runProcess } = useLoading();

	const itemsNames = useMemo(() => {
		return items.map((item) => item.name.toLowerCase());
	}, [items]);

	const inputRef = useRef<HTMLInputElement>(null);

	const wrapperClassName = clsx(
		`${ROOT_CLASS_NAME}__wrapper`,
		isInvalid && `${ROOT_CLASS_NAME}__wrapper_invalid`
	);
	const inputClassName = clsx(
		`${ROOT_CLASS_NAME}__input`,
		'controls-fontweight-medium',
		isEditing && `${ROOT_CLASS_NAME}__input_editing`,
		!isEditing && !value.length && `${ROOT_CLASS_NAME}__input_static`
	);
	const actionButtonClassName = clsx(`${ROOT_CLASS_NAME}__actionButton`);

	const validate = (): boolean | string => {
		const trimmed = value.trim();

		if (trimmed === '') {
			return DEFAULT_EMPTY_NAME_MESSAGE;
		}

		const invalid = trimmed === '' || itemsNames.includes(trimmed.toLowerCase());

		return invalid ? DEFAULT_VALIDATION_FAIL_MESSAGE : true;
	};

	const onResetClick = () => {
		setIsEditing(() => false);
		setValue(() => '');
		setIsInvalid(() => false);
	};

	const validationFail = (message: string) => {
		setIsInvalid(() => true);
		if (invalidTimer) {
			clearTimeout(invalidTimer);
		} else {
			toast(message, {
				type: 'error',
				autoClose: 1800,
			});
		}

		const timer = setTimeout(() => {
			setIsInvalid(() => false);
			setInvalidTimer(() => null);
		}, 2300);

		setInvalidTimer(() => timer);
	};

	const createParkingSpot = () => {
		runProcess(() => {
			// Проверка на авторизацию и права
			if (userAtom.parkingId && authAtom.role === 'admin') {
				const parkingSpotsRef = collection(db, 'parkingSpots');
				const q = query(parkingSpotsRef, where('name', '==', value));

				// Проверка на существование места с таким именем
				return getDocs(q).then((snap) => {
					if (!snap.empty) {
						toast(DEFAULT_VALIDATION_FAIL_MESSAGE, {
							type: 'error',
							autoClose: 1800,
						});

						return Promise.reject();
					}

					const spot: Omit<IAdminParkingSpot, 'key'> = {
						name: value,
						parkingId: userAtom.parkingId,
						attachedUserId: null,
					};

					const parkingSpotRef = doc(collection(db, 'parkingSpots'));

					// Создание места
					return setDoc(parkingSpotRef, spot)
						.then(() => {
							const newItem: IAdminParkingSpot = {
								key: parkingSpotRef.id,
								...spot,
							};
							setItems((prev) => [newItem, ...prev]);

							return Promise.resolve(newItem);
						})
						.catch(() => {
							toast('Не удалось создать место!', {
								type: 'error',
								autoClose: 2000,
							});
						});
				});
			}

			return Promise.reject();
		}).then((res?: IAdminParkingSpot) => {
			if (res?.key) {
				navigate(`/parking-spot-editing/${res.key}`);
				toast('Место создано!', {
					type: 'success',
					autoClose: 1300,
				});
			}
			onResetClick();
		});
	};

	const onCommitClick = () => {
		const validationRes = validate();
		if (validationRes === true) {
			createParkingSpot();
			// TODO: создание новой записи в БД, ресет поля ввода, доабвление карточки в массив элементов
		} else {
			validationFail(validationRes as string);
		}
	};

	const onFocus = () => {
		inputRef.current?.select();
		setIsEditing(() => true);
	};

	const onBlur = () => {
		setIsEditing(() => false);
	};

	const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = target.value;
		setValue(() => newValue);
	};

	return (
		<div className={wrapperClassName}>
			{loading ? (
				<img src={LoaderGif} />
			) : (
				<>
					{!!value.length && (
						<Button
							className={actionButtonClassName}
							icon={
								<CrossCircleIcon
									className='controls-fontcolor-error'
									size={28}
								/>
							}
							onClick={onResetClick}
						/>
					)}
					<input
						ref={inputRef}
						className={inputClassName}
						value={isEditing ? value : !!value.length ? value : DEFAULT_STATIC_SYMBOL}
						maxLength={6}
						onBlur={onBlur}
						onFocus={onFocus}
						onChange={onChange}
					/>
					{!!value.length && (
						<Button
							className={actionButtonClassName}
							disabled={isInvalid}
							icon={
								<CommitIcon
									className='controls-fontcolor-accent'
									size={28}
								/>
							}
							onClick={onCommitClick}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default AdminAddSpotButton;
