import MyGivenSpotRegistry from '../../../components/_myGiven/_registry/MyGivenSpotRegistry';
import { SpotStatus } from '../../../components/_myGiven/types/SpotStatus';
import MySpotCard from '../../../components/_mySpotCard/MySpotCard';

const GivenUpSubScreen = () => {
	return (
		<>
			<MySpotCard
				className='controls-margin_top-4xl'
				spotName='1998'
			/>
			<MyGivenSpotRegistry
				className='controls-margin_top-3xl'
				items={[
					{
						id: '123',
						spotName: '12A-C',
						startDate: new Date(),
						endDate: new Date(),
						status: SpotStatus.Free,
					},
					{
						id: '1235',
						spotName: '12A-C',
						startDate: new Date(),
						endDate: new Date(),
						status: SpotStatus.Occupied,
					},
					{
						id: '12355',
						spotName: '12A-C',
						startDate: new Date(),
						endDate: null,
						status: SpotStatus.Free,
					},
				]}
			/>
		</>
	);
};

export default GivenUpSubScreen;
