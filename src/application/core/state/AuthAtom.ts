import { atom } from 'recoil';

export interface IAuthAtom {
	logged: boolean;
	role: 'user' | 'admin' | null;
}

export const AuthAtom = atom<IAuthAtom>({
	key: 'AuthAtom',
	default: {
		logged: false,
		role: null,
	},
});
