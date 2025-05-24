import { ToastContainer } from 'react-toastify';
import './App.css';
import MainScreen from './application/screens/_main/MainScreen';
import OccupateScreen from './application/screens/_occupate/OccupateScreen';
import GiveUpScreen from './application/screens/_giveUp/GiveUpScreen';
import ProfileScreen from './application/screens/_profile/ProfileScreen';

function App() {
	return (
		<>
			<ToastContainer />
			{/* <MainScreen /> */}
			{/* <OccupateScreen /> */}
			{/* <GiveUpScreen /> */}
			<ProfileScreen
				defaultValues={{
					phone: '+79536050839',
					licencePlate: 'А123МР196',
					telegram: '@avada.kedavra',
				}}
			/>
		</>
	);
}

export default App;
