import { atom } from 'recoil';

export interface IUserAtom {
	email: string | null;
	fullName: string | null;
	licencePlate: string | null;
	telegram: string | null;
	parkingId: string | null;
	parkingSpotId: string | null;
}

export const UserAtom = atom<IUserAtom>({
	key: 'UserAtom',
	default: {
		email: null,
		fullName: null,
		licencePlate: null,
		telegram: null,
		parkingId: null,
		parkingSpotId: null,
	},
});
