import './SpotEditingScreen.css';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Title from '../../../controls/_title/Title';
import clsx from 'clsx';
import Button from '../../../controls/_button/Button';
import AdminSpotUserSelector from '../../components/_adminParkingSpots/_spotUserSelector/AdminSpotUserSelector';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLoading } from '../../core/utils/useLoading';
import ParkingScreen from '../_parking/ParkingScreen';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	QuerySnapshot,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useRecoilValue } from 'recoil';
import { UserAtom, type IUserAtom } from '../../core/state/UserAtom';
import type { IAdminParkingSpot } from '../../components/_adminParkingSpots/_registry/AdminParkingSpotsRegistry';
import TrashIcon from '../../../controls/_icons/TrashIcon';
import PopupDialog, { type TPopupDialogAPI } from '../../../controls/_popup/PopupDialog';

import InnerLoader from '../../components/_innerLoader/InnerLoader';
import { toast } from 'react-toastify';

const ROOT_CLASS_NAME = 'spotEditingScreen';

interface IParkingSpot {
	attachedUserId: string | null;
	name: string | null;
	parkingId: string | null;
}

export type TUser = IUserAtom & {
	id: string;
};

const SpotEditingScreen = () => {
	const params = useParams();
	const id = params.id;
	const navigate = useNavigate();
	const [spotOwner, setSpotOwner] = useState<TUser | null>(null);
	const [_initialSpotOwner, setInitialSpotOwner] = useState<TUser | null>(null);
	const [allParkingSpots, setAllParkingSpots] = useState<IAdminParkingSpot[]>([]);
	const [users, setUsers] = useState<TUser[]>([]);
	const userAtom = useRecoilValue(UserAtom);
	const [saveDisabled, setSaveDisabled] = useState(true);
	const [deleteDisabled, setDeleteDisabled] = useState(true);
	const [unknownSpot, setUnknownSpot] = useState(false);
	const [parkingSpot, setParkingSpot] = useState<IParkingSpot | null>(null);
	const popupRef = useRef<TPopupDialogAPI>(null);
	const pageLoading = useLoading();
	const saveLoading = useLoading();

	const spotTitleClassName = clsx(`${ROOT_CLASS_NAME}__spotTitle`, 'controls-fontsize-24');
	const titleWrapperClassName = clsx(`${ROOT_CLASS_NAME}__titleWrapper`);

	useEffect(() => {
		if (allParkingSpots.length && parkingSpot === null) {
			setUnknownSpot(() => true);
		}
	}, [allParkingSpots, parkingSpot]);

	useEffect(() => {
		if (id) {
			const promises: any[] = [];

			if (id && userAtom.parkingId) {
				const q = query(
					collection(db, 'parkingSpots'),
					where('parkingId', '==', userAtom.parkingId),
					orderBy('name')
				);
				promises.push(
					getDocs(q)
						.then((querySnapshot: QuerySnapshot) => {
							const spotsData: IAdminParkingSpot[] = querySnapshot.docs.map(
								(doc) => ({
									key: doc.id,
									...(doc.data() as Omit<IAdminParkingSpot, 'key'>),
								})
							);
							setAllParkingSpots(() => spotsData);
							setParkingSpot(() => {
								if (id) {
									return spotsData.find((spot) => spot.key === id) ?? null;
								}

								return null;
							});
						})
						.catch(() => {})
				);
			}

			if (id && userAtom.parkingId) {
				const q = query(
					collection(db, 'users'),
					where('parkingId', '==', userAtom.parkingId)
				);
				promises.push(
					getDocs(q)
						.then((docsSnap) => {
							const usersData = docsSnap.docs.map((doc) => {
								return {
									id: doc.id,
									...doc.data(),
								};
							}) as TUser[];
							setUsers(() => usersData);
						})
						.catch(() => Promise.resolve())
				);
			}

			pageLoading.runProcess(() => Promise.all(promises));
		}
	}, []);

	useEffect(() => {
		if (parkingSpot?.attachedUserId && users) {
			const owner = users.find((user) => user.id === parkingSpot.attachedUserId);
			setSpotOwner(() => owner || null);
			setInitialSpotOwner(() => owner || null);
		} else if (!parkingSpot?.attachedUserId) {
		}

		if (users.length && !parkingSpot?.attachedUserId) {
			setDeleteDisabled(() => false);
		}
	}, [parkingSpot, users]);

	const disabledUsersIds: string[] = useMemo(() => {
		return allParkingSpots.map((spot) => spot.attachedUserId).filter((id) => id) as string[];
	}, [allParkingSpots]);

	const onDeleteSpotClick = () => {
		popupRef.current?.show().then((res) => {
			if (res && id) {
				deleteDoc(doc(db, 'parkingSpots', id))
					.then(() => {
						toast('Парковочное место удалено!', {
							type: 'info',
							autoClose: 1000,
						});
						navigate('/admin');
					})
					.catch(() => {
						toast('Что-то пошло не так! Не удалось удалить место!', {
							type: 'error',
							autoClose: 2500,
						});
					});
			}
		});
	};

	const onSaveChangesClick = () => {
		saveLoading
			.runProcess(() => {
				if (id) {
					return updateDoc(doc(db, 'parkingSpots', id), {
						attachedUserId: spotOwner?.id || null,
					});
				}

				return Promise.reject();
			})
			.then(() => {
				toast('Данные сохранены!', {
					type: 'success',
					autoClose: 1000,
				});
				setSaveDisabled(() => true);
				// if (spotOwner) {
				// 	navigate('/admin');
				// }
			})
			.catch(() => {
				toast('Что-то пошло не так! Данные не сохранены!', {
					type: 'error',
					autoClose: 2500,
				});
			});
	};

	// Функция, вызываемая изнутри реестра пользователей при нажатии кнопки "Отвязать"
	const onDeattach = (_user: TUser) => {
		setSaveDisabled(() => false);
		setSpotOwner(() => null);
		setDeleteDisabled(() => false);

		const index = allParkingSpots.findIndex((spot) => spot.key === id);
		if (index !== -1) {
			setAllParkingSpots((prev) => {
				const newSpots = [...prev];
				newSpots[index].attachedUserId = null;

				return newSpots;
			});
		}
	};

	// Функция, вызываемая изнутри реестра пользователей при выборе конкретного пользователя из списка
	const onOwnerSelected = (user: TUser) => {
		setSaveDisabled(() => false);
		setSpotOwner(() => user);
		setDeleteDisabled(() => true);

		const index = allParkingSpots.findIndex((spot) => spot.key === id);

		if (index !== -1) {
			setAllParkingSpots((prev) => {
				const newSpots = [...prev];
				newSpots[index].attachedUserId = user.id;

				return newSpots;
			});
		}
	};

	if (!id || unknownSpot) {
		return <ParkingScreen />;
	}

	return (
		<>
			<PopupDialog
				ref={popupRef}
				title={`Удалить парковочное место ${parkingSpot?.name}?`}
				detail='Восставновить его не получится, но можно бдует создать новое с такими же параметрами'
				showCommitButton
				showRejectButton
			/>
			{/* <DebouncedLoaderScreen loading={loading} /> */}
			<div>
				<Header
					showHome
					homePosition='left'
				/>
				<ScreenLayout>
					<div className={titleWrapperClassName}>
						<Title text='Парковочное место' />
						<Button
							icon={
								<TrashIcon
									className={
										deleteDisabled
											? 'controls-fontcolor-unactive'
											: 'controls-fontcolor-error'
									}
									size={30}
								/>
							}
							disabled={deleteDisabled}
							onClick={onDeleteSpotClick}
						/>
					</div>
					<div className={spotTitleClassName}>
						{pageLoading.loading ? (
							<InnerLoader
								style='dark'
								height={50}
							/>
						) : (
							parkingSpot?.name || ''
						)}
					</div>
					<div
						className={clsx(
							'controls-fontcolor-main',
							'controls-text-center',
							'controls-margin_top-l'
						)}
					>
						Закреплено за пользователем
					</div>
					<AdminSpotUserSelector
						className='controls-margin_top-l'
						initialSelectedValue={spotOwner}
						users={users}
						disabledUsersIds={disabledUsersIds}
						onDeattach={onDeattach}
						onOwnerSelected={onOwnerSelected}
						loading={pageLoading.loading}
					/>
					<Button
						className={clsx('controls-margin_top-3xl')}
						title='Сохранить изменения'
						fullWidth
						disabled={saveDisabled}
						onClick={onSaveChangesClick}
						loading={saveLoading.loading}
					/>
					{/* <Button
						className={clsx('controls-margin_top-3xl')}
						title='Удалить место'
						color={spotOwner ? 'white' : 'error'}
						backgroundColor='white'
						showBorder={!spotOwner}
						fullWidth
					/> */}
				</ScreenLayout>
			</div>
		</>
	);
};

export default SpotEditingScreen;
