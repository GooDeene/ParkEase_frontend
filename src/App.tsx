import { ToastContainer } from 'react-toastify';
import './App.css';
import MainScreen from './application/screens/_main/MainScreen';

function App() {
	return (
		<>
			<ToastContainer />
			<MainScreen />
			{/* <OccupateScreen /> */}
			{/* <GiveUpScreen /> */}
			{/* <ProfileScreen
				defaultValues={{
					phone: '+79536050839',
					licencePlate: 'А123МР196',
					telegram: '@avada.kedavra',
				}}
			/> */}
		</>
	);
}

export default App;
