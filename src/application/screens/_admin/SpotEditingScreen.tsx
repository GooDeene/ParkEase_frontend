import './SpotEditingScreen.css';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Title from '../../../controls/_title/Title';

const SpotEditingScreen = () => {
	return (
		<div>
			{/* <ConfirmationDialog title='Вы точно хотите отвязать владельца места?' detail='Это приведет к потере всех уступленных промежутков'/> */}
			<Header />
			<ScreenLayout>
				<Title text='Парковочное место' />
			</ScreenLayout>
		</div>
	);
};

export default SpotEditingScreen;
