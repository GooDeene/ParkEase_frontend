import GivenUpRegistry from '../../../components/_givenUp/_registry/GivenUpRegistry';
import OccupiedDateFilter from '../../../components/_occupied/_filter/OccupiedDateFilter';
import OccupiedRegistry from '../../../components/_occupied/_registry/OccupiedRegistry';

const OccupiedSubScreen = () => {
	return (
		<>
			<OccupiedRegistry
				className='controls-margin_bottom-l'
				items={[
					{
						id: '123',
						startDate: new Date(),
						endDate: new Date(),
						owner: {
							phone: '89536050838',
							telegram: '@v_medvedevskiadasdasdasdawdawdawdawdy',
						},
						spotName: '31л',
					},
					{
						id: '456',
						startDate: new Date(),
						endDate: null,
						owner: {
							phone: null,
							telegram: null,
						},
						spotName: '148',
					},
				]}
				showBottomSeparator
			/>
			<OccupiedDateFilter className='controls-margin_bottom-3xl' />
			<GivenUpRegistry
				items={[
					{
						id: '123',
						startDate: new Date(),
						endDate: new Date(),
						owner: {
							phone: '89536050838',
							telegram: '@avada_keda5ra_and_abra_kadabra_extra_large_nckname',
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
					// {
					// 	id: '2',
					// 	startDate: new Date(),
					// 	endDate: null,
					// 	owner: {
					// 		phone: null,
					// 		telegram: '@pihny_sladko',
					// 	},
					// 	spotName: '148',
					// },
				]}
			/>
		</>
	);
};

export default OccupiedSubScreen;
