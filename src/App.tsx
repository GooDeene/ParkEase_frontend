import { ToastContainer } from 'react-toastify';
import './App.css';
import AuthorizeScreen from './application/screens/_authorize/AuthorizeScreen';

function App() {
	return (
		<>
			<ToastContainer />
			<AuthorizeScreen />
			{/* <MainScreen /> */}
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
