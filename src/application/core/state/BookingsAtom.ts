import { atom } from 'recoil';

export interface IBooking {
	id: string;
	leaseId: string;
	renterId: string;
	startDate: Date;
	endDate: Date;
	parkingSpotId: string;
	parkingSpotName: string;
}

export const BookingsAtom = atom<IBooking[]>({
	key: 'MyBookingsAtom',
	default: [],
});
