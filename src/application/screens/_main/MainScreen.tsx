import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Switch from '../../../controls/_switch/Switch';
import OccupiedSubScreen from './_subScreens/OccupiedSubScreen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './MainScreen.css';
import GivenUpSubScreen from './_subScreens/GivenUpSubScreen';
import { useLocation, useNavigate, useParams } from 'react-router';
import Title from '../../../controls/_title/Title';
import type { ILease } from '../../core/state/MyLeases';
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';
import { BookingsAtom, type IBooking } from '../../core/state/BookingsAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MainFilterAtom } from '../../core/state/MainFilterAtom';
import { useLoading } from '../../core/utils/useLoading';
import { isDatesEqual } from '../../../controls/utils/isDatesEqual';

enum SwithcValue {
	Occupate = 'occupate',
	GiveUp = 'giveUp',
}

const SWITCH_ITEMS = {
	left: {
		title: 'Занять',
		value: SwithcValue.Occupate,
	},
	right: {
		title: 'Уступить',
		value: SwithcValue.GiveUp,
	},
};

type TBookingsMap = {
	[key in string]: IBooking[];
};

const ROOT_CLASS_NAME = 'mainScreen';

const filterAndCollapseAvailableIntervals = (
	rawAvailableSpots: ILease[],
	bookingsMap: TBookingsMap,
	start: Date | null,
	end: Date | null
): ILease[] => {
	if (start === null) {
		return rawAvailableSpots.filter(
			(spot, idx, allSpots) =>
				idx === allSpots.findIndex((s) => s.parkingSpotId === spot.parkingSpotId)
		);
	}

	const res: ILease[] = [];
	const includedIds: string[] = [];

	for (const availableSpot of rawAvailableSpots) {
		if (includedIds.includes(availableSpot.parkingSpotId)) {
			continue;
		}

		const bookingsToThisSpot = bookingsMap[availableSpot.id] || [];
		let isValid = true;

		for (const booking of bookingsToThisSpot) {
			if (
				end &&
				((start >= booking.startDate && start <= booking.endDate) ||
					(end >= booking.startDate && end <= booking.endDate))
			) {
				isValid = false;
				break;
			} else if (start >= booking.startDate && start <= booking.endDate) {
				isValid = false;
				break;
			}
		}

		if (isValid) {
			res.push(availableSpot);
			includedIds.push(availableSpot.parkingSpotId);
		}
	}

	return res;
};

const MainScreen = () => {
	const switchClassName = clsx(`${ROOT_CLASS_NAME}__modeSwitch`, 'controls-margin_bottom-l');

	const locaction = useLocation();
	const params = useParams();
	const mode = params.mode;
	const navigate = useNavigate();

	const [bookingsAtom, setBookingsAtom] = useRecoilState(BookingsAtom);
	const mainFilterAtom = useRecoilValue(MainFilterAtom);

	const [availableSpots, setAvailableSpots] = useState<ILease[]>([]);
	const registryLoading = useLoading();
	const bookingsLoading = useLoading();

	const [switchValue, setSwitchValue] = useState<SwithcValue>(
		mode === SwithcValue.GiveUp ? mode : SwithcValue.Occupate
	);

	// Карта вида leaseId: IBooking[]
	const bookingsMap = useMemo(() => {
		const res: TBookingsMap = {};
		bookingsAtom.forEach((booking) => {
			const key = booking.leaseId;

			if (res.hasOwnProperty(key)) {
				res[key].push(booking);
			} else {
				res[key] = [booking];
			}
		});

		return res;
	}, [bookingsAtom]);

	const onSwitchChanged = (val: string) => {
		setSwitchValue(() => val as SwithcValue);
		navigate(`/main/${val}`);
	};

	const updateBookings = useCallback(() => {
		bookingsLoading.runProcess(() => {
			const myBookingsQuery = query(collection(db, 'bookings'));

			return getDocs(myBookingsQuery).then((snap) => {
				if (!snap.empty) {
					const bookings = snap.docs.map((doc) => {
						const booking = doc.data();
						const start = booking.startDate?.toDate();
						const end = booking.endDate?.toDate();

						return {
							...booking,
							id: doc.id,
							startDate: start ? new Date(start.toDateString()) : start,
							endDate: isDatesEqual(start, end)
								? start
								: end
								? new Date(end.toDateString())
								: end,
						} as IBooking;
					});

					setBookingsAtom(() => bookings);
				} else {
					setBookingsAtom(() => []);
				}
			});
		});
	}, []);

	useEffect(() => {
		if (locaction.state?.updateBookings) {
			updateBookings();
		}
	}, []);

	useEffect(() => {
		if (auth.currentUser) {
			registryLoading.runProcess(() => {
				const filters = [where('ownerId', '!=', auth.currentUser?.uid)];

				if (mainFilterAtom.start) {
					filters.push(
						where('startDate', '<=', Timestamp.fromDate(mainFilterAtom.start)),
						where(
							'endDate',
							'>=',
							Timestamp.fromDate(mainFilterAtom.end || mainFilterAtom.start)
						)
					);
				}

				return getDocs(query(collection(db, 'leases'), ...filters)).then((snap) => {
					if (!snap.empty) {
						const leases = snap.docs.map((doc) => {
							const data = doc.data();
							return {
								...data,
								id: doc.id,
								startDate: data.startDate?.toDate(),
								endDate: data.endDate?.toDate(),
							} as ILease;
						});

						setAvailableSpots(() =>
							filterAndCollapseAvailableIntervals(
								leases,
								bookingsMap,
								mainFilterAtom.start,
								mainFilterAtom.end
							)
						);
					} else {
						setAvailableSpots(() => []);
					}

					return Promise.resolve();
				});
			});
		}
	}, [mainFilterAtom]);

	return (
		<div>
			<Header />
			<ScreenLayout>
				<div className={switchClassName}>
					<Title
						className='controls-margin_bottom-l'
						text='Место на парковке'
					/>
					<Switch
						value={switchValue}
						items={SWITCH_ITEMS}
						onValueChanged={onSwitchChanged}
					/>
				</div>
				{switchValue === SwithcValue.Occupate ? (
					<OccupiedSubScreen
						items={availableSpots}
						bookingsLoading={bookingsLoading.loading}
						loading={registryLoading.loading}
					/>
				) : (
					<GivenUpSubScreen />
				)}
			</ScreenLayout>
		</div>
	);
};

export default MainScreen;
