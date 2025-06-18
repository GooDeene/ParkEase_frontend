import { useRecoilState } from 'recoil';
import MyGivenSpotRegistry from '../../../components/_myGiven/_registry/MyGivenSpotRegistry';
import MySpotCard from '../../../components/_mySpotCard/MySpotCard';
import { MyLeasesAtom } from '../../../core/state/MyLeases';
import { useMemo } from 'react';

const GivenUpSubScreen = () => {
	const [myLeasesAtom] = useRecoilState(MyLeasesAtom);

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

	// const onReloadClick = () => {
	// 	runProcess(() => {
	// 		if (auth.currentUser) {
	// 			const leasesRef = collection(db, 'leases');
	// 			const leasesQuery = query(leasesRef, where('ownerId', '==', auth.currentUser.uid));
	// 			return getDocs(leasesQuery).then((snap) => {
	// 				if (!snap.empty) {
	// 					const docs = snap.docs;
	// 					setMyLeasesAtom(() =>
	// 						docs.map((doc) => {
	// 							const data = doc.data();

	// 							const start = data.startDate?.toDate();
	// 							const end = data.endDate?.toDate();

	// 							return {
	// 								...data,
	// 								id: doc.id,
	// 								startDate: start ? new Date(start.toDateString()) : start,
	// 								endDate: isDatesEqual(start, end)
	// 									? start
	// 									: end
	// 									? new Date(end.toDateString())
	// 									: end,
	// 							} as ILease;
	// 						})
	// 					);
	// 				} else {
	// 					setMyLeasesAtom(() => []);
	// 				}
	// 			});
	// 		}
	// 	});
	// };

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
