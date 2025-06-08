import { atom } from 'recoil';

export interface IMySpotAtom {
	name: string | null;
	parkingId: string | null;
}

export const MySpotAtom = atom<IMySpotAtom>({
	key: 'MySpotAtom',
	default: {
		name: null,
		parkingId: null,
	},
});
