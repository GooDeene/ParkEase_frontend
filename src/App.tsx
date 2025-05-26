import { ToastContainer } from 'react-toastify';
import './App.css';
import AuthorizeScreen from './application/screens/_authorize/AuthorizeScreen';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import MainScreen from './application/screens/_main/MainScreen';
import ProfileScreen from './application/screens/_profile/ProfileScreen';
import OccupateScreen from './application/screens/_occupate/OccupateScreen';
import GiveUpScreen from './application/screens/_giveUp/GiveUpScreen';
import ParkingScreen from './application/screens/_parking/ParkingScreen';

function App() {
	return (
		<>
			<ToastContainer />
			<BrowserRouter>
				<Routes>
					<Route
						path='/auth'
						element={<AuthorizeScreen />}
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
			</BrowserRouter>
		</>
	);
}

export default App;
