import { useState } from 'react';
import './App.css';
import Button from './controls/_button/Button';
import TextInput from './controls/_input/TextInput';
import Switch from './controls/_switch/Switch';
import { isRequired } from './controls/_input/validators/isRequired';
import { isValidRussianPhone } from './controls/_input/validators/isValidRussianPhone';
import { isLicensePlate } from './controls/_input/validators/isLicensePlate';

function App() {
	const [val, setVal] = useState('');
	return (
		<>
			<img src='/src/assets/logo_big.svg' />
			<Button
				title='Кнопочка'
				fullWidth
				className='controls-margin_bottom-xl'
			/>
			<Switch
				items={{
					left: {
						title: 'Занять',
						value: 'auth',
					},
					right: {
						title: 'Уступить',
						value: 'reg',
					},
				}}
			/>
			<TextInput
				value={val}
				type='tel'
				placeholder='+79001112233'
				hint='Телефон'
				onValueChanged={(value) => setVal(() => value)}
				validators={[isRequired, isValidRussianPhone]}
				validateOnFocusOut
			/>
			<TextInput
				value={val}
				type='text'
				placeholder='М001ММ777'
				hint='Гос. номер авто'
				onValueChanged={(value) => setVal(() => value)}
				validators={[isRequired, isLicensePlate]}
				validateOnFocusOut
			/>
		</>
	);
}

export default App;
