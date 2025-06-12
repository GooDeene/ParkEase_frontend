import './SpotEditingScreen.css';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Title from '../../../controls/_title/Title';
import clsx from 'clsx';
import Button from '../../../controls/_button/Button';
import AdminSpotUserSelector from '../../components/_adminParkingSpots/_spotUserSelector/AdminSpotUserSelector';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLoading } from '../../core/utils/useLoading';
import ParkingScreen from '../_parking/ParkingScreen';
import { collection, getDocs, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useRecoilValue } from 'recoil';
import { UserAtom, type IUserAtom } from '../../core/state/UserAtom';
import DebouncedLoaderScreen from '../_debouncedLoader/DebouncedLoaderScreen';
import type { IAdminParkingSpot } from '../../components/_adminParkingSpots/_registry/AdminParkingSpotsRegistry';
import TrashIcon from '../../../controls/_icons/TrashIcon';

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
	const [spotOwner, setSpotOwner] = useState<TUser | null>(null);
	const [_initialSpotOwner, setInitialSpotOwner] = useState<TUser | null>(null);
	const [allParkingSpots, setAllParkingSpots] = useState<IAdminParkingSpot[]>([]);
	const [users, setUsers] = useState<TUser[]>([]);
	const userAtom = useRecoilValue(UserAtom);
	const [saveDisabled, setSaveDisabled] = useState(true);
	const { loading, runProcess } = useLoading();
	const spotTitleClassName = clsx(`${ROOT_CLASS_NAME}__spotTitle`, 'controls-fontsize-24');
	const titleWrapperClassName = clsx(`${ROOT_CLASS_NAME}__titleWrapper`);

	const parkingSpot: IParkingSpot | null = useMemo(() => {
		if (id) {
			return allParkingSpots.find((spot) => spot.key === id) ?? null;
		}

		return null;
	}, [allParkingSpots]);

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
					getDocs(q).then((querySnapshot: QuerySnapshot) => {
						const spotsData: IAdminParkingSpot[] = querySnapshot.docs.map((doc) => ({
							key: doc.id,
							...(doc.data() as Omit<IAdminParkingSpot, 'key'>),
						}));
						setAllParkingSpots(() => spotsData);
					})
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

			runProcess(() => Promise.all(promises));
		}
	}, []);

	useEffect(() => {
		if (parkingSpot?.attachedUserId && users) {
			const owner = users.find((user) => user.id === parkingSpot.attachedUserId);
			setSpotOwner(() => owner || null);
			setInitialSpotOwner(() => owner || null);
		}
	}, [parkingSpot, users]);

	if (!id) {
		return <ParkingScreen />;
	}

	const disabledUsersIds: string[] = useMemo(() => {
		return allParkingSpots.map((spot) => spot.attachedUserId).filter((id) => id) as string[];
	}, [allParkingSpots]);

	const onDeleteSpotClick = () => {};

	const onSaveChangesClick = () => {};

	// Функция, вызываемая изнутри реестра пользователей при нажатии кнопки "Отвязать"
	const onDeattach = (_user: TUser) => {
		setSaveDisabled(() => false);
		setSpotOwner(() => null);

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

		const index = allParkingSpots.findIndex((spot) => spot.key === id);

		if (index !== -1) {
			setAllParkingSpots((prev) => {
				const newSpots = [...prev];
				newSpots[index].attachedUserId = user.id;

				return newSpots;
			});
		}
	};

	return (
		<>
			<DebouncedLoaderScreen loading={loading} />
			<div>
				{/* <ConfirmationDialog title='Вы точно хотите отвязать владельца места?' detail='Это приведет к потере всех уступленных промежутков'/> */}
				<Header
					showHome
					homePosition='center'
				/>
				<ScreenLayout>
					<div className={titleWrapperClassName}>
						<Title text='Парковочное место' />
						<Button
							icon={
								<TrashIcon
									className={
										spotOwner
											? 'controls-fontcolor-unactive'
											: 'controls-fontcolor-error'
									}
									size={30}
								/>
							}
							disabled={!!spotOwner}
							onClick={onDeleteSpotClick}
						/>
					</div>
					<div className={spotTitleClassName}>{parkingSpot?.name || ''}</div>
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
					/>
					<Button
						className={clsx('controls-margin_top-3xl')}
						title='Сохранить изменения'
						fullWidth
						disabled={saveDisabled}
						onClick={onSaveChangesClick}
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
