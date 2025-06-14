import { ToastContainer } from 'react-toastify';
import './App.css';
import AuthorizeScreen from './application/screens/_authorize/AuthorizeScreen';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import MainScreen from './application/screens/_main/MainScreen';
import ProfileScreen from './application/screens/_profile/ProfileScreen';
import OccupateScreen from './application/screens/_occupate/OccupateScreen';
import GiveUpScreen from './application/screens/_giveUp/GiveUpScreen';
import ParkingScreen from './application/screens/_parking/ParkingScreen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { AuthAtom } from './application/core/state/AuthAtom';
import { UserAtom, type IUser } from './application/core/state/UserAtom';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import LoaderScreen from './application/screens/_loader/LoaderScreen';
import ParkingSelectionScreen from './application/screens/_parkingSelection/ParkingSelectionScreen';
import AdminScreen from './application/screens/_admin/AdminScreen';
import SpotEditingScreen from './application/screens/_admin/SpotEditingScreen';
import { MySpotAtom, type IMySpotAtom } from './application/core/state/MySpotAtom';
import { MyLeasesAtom, type ILease } from './application/core/state/MyLeases';
import { BookingsAtom, type IBooking } from './application/core/state/BookingsAtom';
import { isDatesEqual } from './controls/utils/isDatesEqual';

function App() {
	const [loading, setLoading] = useState(true);
	const [showLoader, setShowLoader] = useState(true);
	const [authAtom, setAuthAtom] = useRecoilState(AuthAtom);
	const [userAtom, setUserAtom] = useRecoilState(UserAtom);

	const [_mySpotAtom, setMySpotAtom] = useRecoilState(MySpotAtom);
	const [_myLeasesAtom, setMyLeasesAtom] = useRecoilState(MyLeasesAtom);
	const [_BookigsAtom, setBookingsAtom] = useRecoilState(BookingsAtom);

	const resetAuthAtom = useResetRecoilState(AuthAtom);
	const resetUserAtom = useResetRecoilState(UserAtom);
	const resetMySpotAtom = useResetRecoilState(MySpotAtom);

	const resetAtoms = () => {
		resetAuthAtom();
		resetUserAtom();
		resetMySpotAtom();
	};

	useEffect(() => {
		setTimeout(() => setShowLoader(false), 1300);

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// setLoading(true);
				// Пользователь залогинен — слушаем его данные из Firestore
				const userDocRef = doc(db, 'users', user.uid);

				const unsubscribeUserDoc = onSnapshot(
					userDocRef,
					(docSnap) => {
						if (docSnap.exists()) {
							const userData = docSnap.data() as IUser;

							// установим данные пользователя из БД
							setUserAtom({
								...userData,
							} as IUser);
							setAuthAtom({ logged: true, role: 'user' });

							if (userData.parkingId) {
								// если пользователь привязан к парковке - проверим не админ ли он
								getDoc(doc(db, 'parkings', userData.parkingId)).then(
									(parkingSnap) => {
										if (!parkingSnap.exists()) {
											console.log('Парковка не найдена');
											return;
										}

										const parkingData = parkingSnap.data();

										if (
											Array.isArray(parkingData.admins) &&
											parkingData.admins.includes(user.uid)
										) {
											setAuthAtom((prev) => ({ ...prev, role: 'admin' }));
										}
									}
								);
							}
						} else {
							// Документ пользователя не найден — можно очистить стейт
							resetAtoms();
						}
						setLoading(false);
					},
					() => {
						console.log('Ошибка получения данных пользователя!');
						setLoading(false);
					}
				);

				// Попробуем найти парковочное место, за которым закреплен пользователь
				const spotsQuery = query(
					collection(db, 'parkingSpots'),
					where('attachedUserId', '==', user.uid)
					// limit(1)
				);

				getDocs(spotsQuery).then((snap) => {
					if (!snap.empty) {
						setMySpotAtom(() => {
							return {
								...snap.docs?.[0]?.data(),
								id: snap.docs[0].id,
							} as IMySpotAtom;
						});
					} else {
						console.log('Парковочное место не найдено!');
						resetMySpotAtom();
					}
				});

				// Получим все уступленные прмоежутки данного пользователя
				const leasesRef = collection(db, 'leases');
				const leasesQuery = query(leasesRef, where('ownerId', '==', user.uid));
				getDocs(leasesQuery).then((snap) => {
					if (!snap.empty) {
						const docs = snap.docs;
						setMyLeasesAtom(() =>
							docs.map((doc) => {
								const data = doc.data();

								const start = data.startDate?.toDate();
								const end = data.endDate?.toDate();
								// 	? getDateFromString(data.startDate)
								// 	: null;
								// const end = data.endDate ? getDateFromString(data.endDate) : null;

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
							})
						);
					} else {
						setMyLeasesAtom(() => []);
					}
				});

				// Получим все бронирования для фильтраций и отображений
				const myBookingsQuery = query(collection(db, 'bookings'));

				getDocs(myBookingsQuery).then((snap) => {
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

				// Отписываемся от userDoc при смене пользователя
				return () => {
					unsubscribeUserDoc;
				};
			} else {
				resetAtoms();
				setLoading(false);
			}
		});

		// Очистка подписки при размонтировании
		return unsubscribe;
	}, []);

	if (loading || showLoader) {
		return <LoaderScreen />;
	}

	const AdminRoutes = (
		<>
			<Route
				path='/admin'
				element={<AdminScreen />}
			/>
			<Route
				path='parking-spot-editing/:id'
				element={<SpotEditingScreen />}
			/>
		</>
	);

	return (
		<>
			<ToastContainer />
			<BrowserRouter>
				{authAtom.logged && userAtom.email ? (
					userAtom.parkingId ? (
						<Routes>
							{authAtom.role === 'admin' ? (
								AdminRoutes
							) : (
								<Route
									path='/admin'
									element={<LoaderScreen />}
								/>
							)}
							<Route
								path='/auth'
								element={<Navigate to={'/main/occupied'} />}
							/>
							<Route
								path='/parking-selection'
								element={<Navigate to={'/main/occupied'} />}
							/>
							<Route
								path='/'
								element={<Navigate to={'/main/occupied'} />}
							/>
							<Route
								path={'/main'}
								element={<MainScreen />}
							>
								<Route
									path={':mode'}
									element={<MainScreen />}
								/>
							</Route>
							<Route
								path={'/profile'}
								element={<ProfileScreen />}
							/>
							<Route
								path={'/occupate/:id'}
								element={<OccupateScreen />}
							/>
							<Route
								path={'/give-up'}
								element={<GiveUpScreen />}
							/>
							<Route
								path='*'
								element={<ParkingScreen />}
							/>
						</Routes>
					) : (
						<Routes>
							<Route
								path='/parking-selection'
								element={<ParkingSelectionScreen />}
							/>
							<Route
								path='*'
								element={<Navigate to={'/parking-selection'} />}
							/>
						</Routes>
					)
				) : (
					<Routes>
						<Route
							path='/auth'
							element={<AuthorizeScreen />}
						/>
						<Route
							path='*'
							element={<Navigate to={'/auth'} />}
						/>
					</Routes>
				)}
			</BrowserRouter>
		</>
	);
}

export default App;
