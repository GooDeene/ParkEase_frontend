import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import OwnerCard from '../../../controls/_ownerCard/OwnerCard';
import './OccupateScreen.css';
import Datepicker from '../../../controls/_datepicker/Datepicker';
import Button from '../../../controls/_button/Button';
import { useEffect, useMemo, useState } from 'react';
import { getDatePeriodTitle } from '../../../controls/utils/getDatePeriodTitle';
import { useNavigate, useParams } from 'react-router';
import ParkingScreen from '../_parking/ParkingScreen';
import { useLoading } from '../../core/utils/useLoading';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { BookingsAtom, type IBooking } from '../../core/state/BookingsAtom';
import { collection, doc, getDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';
import type { ILease } from '../../core/state/MyLeases';
import { isDatesEqual } from '../../../controls/utils/isDatesEqual';
import { MainFilterAtom } from '../../core/state/MainFilterAtom';
import type { TPeriod } from '../_giveUp/GiveUpScreen';
import type { IAdminParkingSpot } from '../../components/_adminParkingSpots/_registry/AdminParkingSpotsRegistry';
import type { ISpotOwner } from '../../../controls/types/ISpotOwner';
import type { IUser } from '../../core/state/UserAtom';
import { toast } from 'react-toastify';
import InnerLoader from '../../components/_innerLoader/InnerLoader';

const ROOT_CLASS_NAME = 'occupateScreen';

type TLeaseTargetType = 'inside' | 'startEdge' | 'endEdge' | 'startOnly';

const getIntervalsByEntities = (
	entities: { startDate: Date | null; endDate: Date | null }[]
): TPeriod[] => {
	return entities
		.map((item) => {
			if (item.startDate && item.endDate) {
				return {
					start: item.startDate,
					end: item.endDate,
				};
			} else if (item.startDate) {
				return {
					start: item.startDate,
					end: item.startDate,
				};
			}

			return null;
		})
		.filter((item) => item !== null);
};

const OccupateScreen = () => {
	const infoBlocksClassName = clsx(`${ROOT_CLASS_NAME}__infoBlocks`);
	const spotNameClassName = clsx(`${ROOT_CLASS_NAME}__spotNameWrapper`);
	const spotBlockClassName = clsx(`${ROOT_CLASS_NAME}__spotBlock`, 'controls-fontsize-40');
	const datepickerBlockClassName = clsx(
		`${ROOT_CLASS_NAME}__datepickerBlock`,
		'controls-margin_top-l'
	);
	const submitButtonClassName = clsx(`${ROOT_CLASS_NAME}__submitButton`);

	const navigate = useNavigate();
	const params = useParams();
	const id = params.id;

	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [spotLeases, seSpotLeases] = useState<ILease[]>([]);
	const [spotName, setSpotName] = useState('');
	const [owner, setOwner] = useState<ISpotOwner>({
		email: null,
		telegram: null,
		fullName: null,
	});
	const bookingsAtom = useRecoilValue(BookingsAtom);
	const resetMainFilterAtom = useResetRecoilState(MainFilterAtom);
	// const mySpotAtom = useRecoilValue(MySpotAtom);
	// const mainFilterAtom = useRecoilValue(MainFilterAtom);
	const pageLoading = useLoading();
	const codsCreateLoading = useLoading();

	useEffect(() => {
		if (id) {
			pageLoading.runProcess(() => {
				const q = query(collection(db, 'leases'), where('parkingSpotId', '==', id));

				const promises = [];

				promises.push(
					getDoc(doc(db, 'parkingSpots', id)).then((snap) => {
						if (snap.exists()) {
							const spotInfo = snap.data() as IAdminParkingSpot;
							setSpotName(() => spotInfo.name || '');

							promises.push(
								getDoc(doc(db, 'users', spotInfo.attachedUserId || '')).then(
									(userSnap) => {
										if (userSnap.exists()) {
											const user = userSnap.data() as IUser;
											setOwner(() => {
												return {
													email: user.email,
													telegram: user.telegram,
													fullName: user.fullName,
												};
											});
										}
									}
								)
							);
						}
					})
				);

				promises.push(
					getDocs(q).then((snap) => {
						if (!snap.empty) {
							const leases = snap.docs.map((doc) => {
								const data = doc.data();

								const start = data.startDate?.toDate();
								const end = data.endDate?.toDate();

								return {
									...data,
									id: doc.id,
									startDate: start ? new Date(start.toDateString()) : start,
									endDate: isDatesEqual(start, end)
										? start
										: end
										? new Date(end.toDateString())
										: end,
								} as ILease;
							});

							seSpotLeases(() => leases);
						}
					})
				);

				return Promise.all(promises);
			});
		}
	}, []);

	const includedIntervls: TPeriod[] = useMemo(
		() => getIntervalsByEntities(spotLeases),
		[spotLeases]
	);

	const excludedIntervals = useMemo(() => {
		const res: TPeriod[] = [];
		for (const lease of spotLeases) {
			const bookingsForThisLease = bookingsAtom.filter(
				(booking) => booking.leaseId === lease.id
			);

			res.push(...getIntervalsByEntities(bookingsForThisLease));
		}

		return res;
	}, [bookingsAtom, spotLeases]);

	const onOccupateClick = () => {
		// Выбор пользователя может пересекаться с несколькими промежутками. Необходимо выбрать все, которые затрагивает выбор и создать аренды для каждого из них.
		// if (startDate && endDate) {
		const targetLeases = getLeasesThatIncludesInterval(startDate, endDate, spotLeases);
		// }

		// Используем пакетную запись для всех интервалов уступки
		const transaction = writeBatch(db);

		if (auth.currentUser && id) {
			for (const { targetType, lease } of targetLeases) {
				let resStart = startDate;
				let resEnd = endDate;

				if (targetType === 'inside') {
					resStart = lease.startDate;
					resEnd = lease.endDate || lease.startDate;
				} else if (targetType === 'startEdge') {
					resEnd = lease.endDate || lease.startDate;
				} else if (targetType === 'startOnly') {
					resEnd = resStart;
				} else {
					resStart = lease.startDate;
				}

				const newBooking: Omit<IBooking, 'id'> = {
					startDate: resStart as Date,
					endDate: resEnd as Date,
					renterId: auth.currentUser?.uid,
					parkingSpotId: id,
					parkingSpotName: spotName,
					leaseId: lease.id,
				};

				transaction.set(doc(collection(db, 'bookings')), newBooking);
			}
		}

		codsCreateLoading
			.runProcess(() => {
				return transaction.commit();
			})
			.then(() => {
				toast(
					`Успешно создано ${targetLeases.length} бронировани${
						targetLeases.length === 1 ? 'е' : targetLeases.length >= 5 ? 'ий' : 'я'
					}`,
					{
						type: 'success',
						autoClose: 1500,
					}
				);
				// setTimeout(() => location.reload(), 200);
				resetMainFilterAtom();
				navigate('/main', { state: { updateBookings: true } });
			})
			.catch(() =>
				toast('Что-то пошло не так! Не удалось заннять место!', {
					type: 'error',
					autoClose: 2200,
				})
			);
	};

	if (!id) {
		return <ParkingScreen />;
	}

	return (
		<div>
			<Header showHome />
			<ScreenLayout>
				<div className={infoBlocksClassName}>
					<div className={spotNameClassName}>
						<div className='controls-margin_bottom-3xs'>Занять</div>
						<div className={spotBlockClassName}>{spotName}</div>
					</div>
					<OwnerCard
						item={owner}
						loading={pageLoading.loading}
					/>
				</div>
				<div className={datepickerBlockClassName}>
					{pageLoading.loading ? (
						<InnerLoader
							style='dark'
							height={300}
						/>
					) : (
						<>
							<div className='controls-margin_bottom-3xs'>{`На ${getDatePeriodTitle(
								startDate,
								endDate
							)}`}</div>
							<Datepicker
								calendarClassName='controls-margin_top-l'
								startDate={startDate}
								endDate={endDate}
								onSelectionComplete={(start, end) => {
									setStartDate(() => start);
									setEndDate(() => end);
								}}
								includeDateIntervals={includedIntervls}
								excludeDateIntervals={excludedIntervals}
								inline
							/>
						</>
					)}
				</div>
				<Button
					className={submitButtonClassName}
					title='Занять'
					disabled={startDate === null}
					onClick={onOccupateClick}
				/>
			</ScreenLayout>
		</div>
	);
};

const isDateInsideInterval = (date: Date, start: Date, end: Date): boolean => {
	const s = new Date(start.toDateString() || '');
	const e = new Date(end.toDateString());

	return date >= s && date <= e;
};

const getLeasesThatIncludesInterval = (
	start: Date | null,
	end: Date | null,
	allAvailableLeases: ILease[]
): { targetType: TLeaseTargetType; lease: ILease }[] => {
	const res: { targetType: TLeaseTargetType; lease: ILease }[] = [];

	for (const lease of allAvailableLeases) {
		// Если точка начала выбора внутри интервала и при этом точки конца нет - интервал попадает
		if (start && isDateInsideInterval(start, lease.startDate, lease.endDate) && !end) {
			return [
				{
					targetType: 'startOnly',
					lease,
				},
			];
		}

		// Если старт или конец выбраного периода лежит в пределах интервала сдачи, такой интервал точно принадлежит цели
		if (start && isDateInsideInterval(start, lease.startDate, lease.endDate)) {
			res.push({
				targetType: 'startEdge',
				lease,
			});
			continue;
		}

		if (end && isDateInsideInterval(end, lease.startDate, lease.endDate)) {
			res.push({
				targetType: 'endEdge',
				lease,
			});
			continue;
		}

		// Если весь интервал сдачи лежит внутри выбранного периода полностью - он принадлежит ему
		if (end && start && lease.startDate >= start && lease.endDate <= end) {
			res.push({
				targetType: 'inside',
				lease,
			});
			continue;
		}
	}

	return res;
};

export default OccupateScreen;
