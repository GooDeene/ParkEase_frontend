import Header from '../../../controls/_header/Header';
import Switch from '../../../controls/_switch/Switch';
import GivenUpRegistry from '../../components/_givenUp/_registry/GivenUpRegistry';
import OccupiedDateFilter from '../../components/_occupied/_filter/OccupiedDateFilter';
import OccipiedRegistry from '../../components/_occupied/_registry/OccipiedRegistry';
import './MainScreen.css';

const SWITCH_ITEMS = {
	left: {
		title: 'Занять',
		value: 'auth',
	},
	right: {
		title: 'Уступить',
		value: 'reg',
	},
};

const MainScreen = () => {
	return (
		<div>
			<Header />
			<span>Место на парковке</span>
			<Switch items={SWITCH_ITEMS} />
			<OccipiedRegistry
				items={[
					{
						id: '123',
						startDate: new Date(),
						endDate: new Date(),
						owner: {
							phone: '89536050838',
							telegram: '@avada_keda5ra',
						},
						spotName: '31л',
					},
					{
						id: '456',
						startDate: new Date(),
						endDate: null,
						owner: {
							phone: null,
							telegram: '@pihny_sladko',
						},
						spotName: '148',
					},
				]}
				showBottomSeparator
			/>
			<OccupiedDateFilter />
			<GivenUpRegistry
				items={[
					{
						id: '123',
						startDate: new Date(),
						endDate: new Date(),
						owner: {
							phone: '89536050838',
							telegram: '@avada_keda5ra',
						},
						spotName: '31л',
					},
					{
						id: '13л',
						startDate: new Date(),
						endDate: null,
						owner: {
							phone: null,
							telegram: '@pihny_sladko',
						},
						spotName: '148',
					},
					{
						id: '2',
						startDate: new Date(),
						endDate: null,
						owner: {
							phone: null,
							telegram: '@pihny_sladko',
						},
						spotName: '148',
					},
				]}
			/>
		</div>
	);
};

export default MainScreen;
