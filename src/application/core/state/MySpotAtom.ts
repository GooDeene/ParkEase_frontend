import { atom } from 'recoil';

export interface IMySpotAtom {
	id: string | null;
	name: string | null;
	parkingId: string | null;
}

export const MySpotAtom = atom<IMySpotAtom>({
	key: 'MySpotAtom',
	default: {
		id: null,
		name: null,
		parkingId: null,
	},
});
