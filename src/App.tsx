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
import { UserAtom, type IUserAtom } from './application/core/state/UserAtom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import LoaderScreen from './application/screens/_loader/LoaderScreen';
import ParkingSelectionScreen from './application/screens/_parkingSelection/ParkingSelectionScreen';
import AdminScreen from './application/screens/_admin/AdminScreen';
import SpotEditingScreen from './application/screens/_admin/SpotEditingScreen';

function App() {
	const [loading, setLoading] = useState(true);
	const [showLoader, setShowLoader] = useState(true);
	const [authAtom, setAuthAtom] = useRecoilState(AuthAtom);
	const [userAtom, setUserAtom] = useRecoilState(UserAtom);

	const resetAuthAtom = useResetRecoilState(AuthAtom);
	const resetUserAtom = useResetRecoilState(UserAtom);

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
							const userData = docSnap.data() as IUserAtom;

							// установим данные пользователя из БД
							setAuthAtom({ logged: true, role: 'user' });
							setUserAtom({
								...userData,
							} as IUserAtom);

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
							resetAuthAtom();
							resetUserAtom();
						}
						setLoading(false);
					},
					() => {
						console.log('Ошибка получения данных пользователя!');
						setLoading(false);
					}
				);

				// Отписываемся от userDoc при смене пользователя
				return () => {
					unsubscribeUserDoc;
				};
			} else {
				resetAuthAtom();
				resetUserAtom();
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
				{authAtom.logged ? (
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
