import { atom } from 'recoil';

interface IAuthAtom {
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
