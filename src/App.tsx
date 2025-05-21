import { useState } from 'react';
import './App.css';
import TextInput from './controls/_input/TextInput';
import Switch from './controls/_switch/Switch';
import { isRequired } from './controls/_input/validators/isRequired';
import { isValidRussianPhone } from './controls/_input/validators/isValidRussianPhone';
import { isLicensePlate } from './controls/_input/validators/isLicensePlate';
import Datepicker from './controls/_datepicker/Datepicker';
import Header from './controls/_header/Header';
import OccupiedCard from './application/components/_occupied/_card/OccupiedCard';
import OccipiedRegistry from './application/components/_occupied/_registry/OccipiedRegistry';
import OccupiedDateFilter from './application/components/_occupied/_filter/OccupiedDateFilter';
import OccupiedEmptyHint from './application/components/_occupied/_registry/OccupiedEmptyHint';
import GivenUpRegistry from './application/components/_givenUp/_registry/GivenUpRegistry';
import MainScreen from './application/screens/_main/MainScreen';

function App() {
	const [val, setVal] = useState('');
	return (
		<>
			{/* <img src='/src/assets/logo_big.svg' /> */}
			<MainScreen />
		</>
	);
}

export default App;
