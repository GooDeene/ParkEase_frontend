import { useRecoilValue } from 'recoil';
import MyGivenSpotRegistry from '../../../components/_myGiven/_registry/MyGivenSpotRegistry';
import MySpotCard from '../../../components/_mySpotCard/MySpotCard';
import { MyLeasesAtom } from '../../../core/state/MyLeases';
import { useMemo } from 'react';

const GivenUpSubScreen = () => {
	const myLeasesAtom = useRecoilValue(MyLeasesAtom);

	const items = useMemo(() => {
		return [...myLeasesAtom].sort((a, b) => {
			if (a.startDate && b.startDate && a.startDate > b.startDate) {
				return 1;
			} else if (a.startDate && b.startDate && a.startDate < b.startDate) {
				return -1;
			} else {
				return 0;
			}
		});
	}, [myLeasesAtom]);

	return (
		<>
			<MySpotCard className='controls-margin_top-4xl' />
			<MyGivenSpotRegistry
				className='controls-margin_top-xl'
				items={items}
			/>
		</>
	);
};

export default GivenUpSubScreen;
