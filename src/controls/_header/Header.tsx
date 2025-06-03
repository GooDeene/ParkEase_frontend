import clsx from 'clsx';
import './Header.css';
import Button from '../_button/Button';
import ProfileIcon from '../_icons/ProfileIcon';
import ExitIcon from '../_icons/ExitIcon';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import HomeIcon from '../_icons/HomeIcon';
import { useNavigate } from 'react-router';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { UserAtom } from '../../application/core/state/UserAtom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { AuthAtom } from '../../application/core/state/AuthAtom';

interface IHeaderProps extends IPropsWithClassName {
	showHome?: boolean;
}

const ROOT_CLASS_NAME = 'controls-header';

const Header = ({ showHome = false }: IHeaderProps) => {
	const navigate = useNavigate();

	const resetUserAtom = useResetRecoilState(UserAtom);
	const resetAuthAtom = useResetRecoilState(AuthAtom);

	const userAtom = useRecoilValue(UserAtom);

	const headerButtonClassName = clsx(`${ROOT_CLASS_NAME}__button`);
	const headerTitleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-fontsize-24',
		'controls-fontweight-medium'
	);

	/**
	 * Обработчик клика по кнопки профиля
	 * TODO: редирект на страницу профиля
	 */
	const onProfileClick = () => {
		if (showHome) {
			navigate('/main');
		} else {
			navigate('/profile');
		}
	};

	const onExitCLick = () => {
		signOut(auth)
			.then(() => {
				resetUserAtom();
				resetAuthAtom();
			})
			.catch(() => {
				console.log('Ошибка разлогинивания!');
			});
	};

	return (
		<div className={ROOT_CLASS_NAME}>
			<Button
				className={headerButtonClassName}
				icon={showHome ? <HomeIcon size={40} /> : <ProfileIcon size={40} />}
				onClick={onProfileClick}
			/>
			<span className={headerTitleClassName}>{userAtom.licencePlate}</span>
			<Button
				className={headerButtonClassName}
				icon={<ExitIcon size={40} />}
				onClick={onExitCLick}
			/>
		</div>
	);
};

export default Header;
