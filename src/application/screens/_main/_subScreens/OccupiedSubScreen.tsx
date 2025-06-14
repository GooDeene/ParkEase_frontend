import { useRecoilValue } from 'recoil';
import GivenUpRegistry from '../../../components/_givenUp/_registry/GivenUpRegistry';
import OccupiedDateFilter from '../../../components/_occupied/_filter/OccupiedDateFilter';
import OccupiedRegistry from '../../../components/_occupied/_registry/OccupiedRegistry';
import type { ILease } from '../../../core/state/MyLeases';
import { BookingsAtom } from '../../../core/state/BookingsAtom';
import { useMemo } from 'react';
import { auth } from '../../../../../firebase';
import InnerLoader from '../../../components/_innerLoader/InnerLoader';

interface IOccupiedSubScreenProps {
	items: ILease[];
	loading?: boolean;
	bookingsLoading?: boolean;
}

const OccupiedSubScreen = ({
	items,
	loading = false,
	bookingsLoading = false,
}: IOccupiedSubScreenProps) => {
	const bookingsAtom = useRecoilValue(BookingsAtom);
	const myBookings = useMemo(() => {
		return [...bookingsAtom]
			.filter((booking) => booking.renterId === auth.currentUser?.uid)
			.sort((a, b) => {
				if (a.startDate && b.startDate && a.startDate > b.startDate) {
					return 1;
				} else if (a.startDate && b.startDate && a.startDate < b.startDate) {
					return -1;
				} else {
					return 0;
				}
			});
	}, [bookingsAtom]);

	return (
		<>
			<OccupiedRegistry
				className='controls-margin_bottom-l'
				items={myBookings}
				loading={bookingsLoading}
				showBottomSeparator
			/>
			<OccupiedDateFilter
				className='controls-margin_bottom-3xl'
				excludedIntervals={myBookings.map((booking) => {
					const start = booking.startDate;
					return {
						start: start,
						end: booking.endDate ?? booking.startDate,
					};
				})}
			/>
			{loading ? <InnerLoader style='dark' /> : <GivenUpRegistry items={items} />}
		</>
	);
};

export default OccupiedSubScreen;
