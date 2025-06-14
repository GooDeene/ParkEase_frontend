import { atom } from 'recoil';

export interface IUser {
	email: string | null;
	fullName: string | null;
	licencePlate: string | null;
	telegram: string | null;
	parkingId: string | null;
}

export const UserAtom = atom<IUser>({
	key: 'UserAtom',
	default: {
		email: null,
		fullName: null,
		licencePlate: null,
		telegram: null,
		parkingId: null,
	},
});
