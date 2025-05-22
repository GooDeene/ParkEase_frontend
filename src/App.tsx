import { ToastContainer } from 'react-toastify';
import './App.css';
import MainScreen from './application/screens/_main/MainScreen';
import OwnerCard from './controls/_ownerCard/OwnerCard';
import OccupateScreen from './application/screens/_occupate/OccupateScreen';

function App() {
	return (
		<>
			<ToastContainer />
			{/* <MainScreen /> */}
			<OccupateScreen />
		</>
	);
}

export default App;
