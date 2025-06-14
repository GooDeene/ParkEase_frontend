import { atom } from 'recoil';

export interface IMainfilteratom {
	start: Date | null;
	end: Date | null;
}

export const MainFilterAtom = atom<IMainfilteratom>({
	key: 'MainFilterAtom',
	default: {
		start: null,
		end: null,
	},
});
