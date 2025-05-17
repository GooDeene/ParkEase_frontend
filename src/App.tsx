import './App.css';
import Button from './controls/_button/Button';
import Switch from './controls/_switch/Switch';

function App() {
	return (
		<>
			<div>Номер не соответсвует формату!</div>
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
		</>
	);
}

export default App;
