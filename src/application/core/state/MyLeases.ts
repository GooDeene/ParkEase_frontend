import { atom } from 'recoil';

export interface ILease {
	id: string;
	parkingSpotId: string;
	parkingSpotName: string | null;
	ownerId: string;
	startDate: Date;
	endDate: Date;
}

export const MyLeasesAtom = atom<ILease[]>({
	key: 'MyLeasesAtom',
	default: [],
});
