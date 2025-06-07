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
import AdminIcon from '../_icons/AdminIcon';

interface IHeaderProps extends IPropsWithClassName {
	showHome?: boolean;
	homePosition?: 'left' | 'center';
}

const ROOT_CLASS_NAME = 'controls-header';

const Header = ({ showHome = false, homePosition = 'left' }: IHeaderProps) => {
	const navigate = useNavigate();

	const resetUserAtom = useResetRecoilState(UserAtom);
	const resetAuthAtom = useResetRecoilState(AuthAtom);

	const userAtom = useRecoilValue(UserAtom);
	const authAtom = useRecoilValue(AuthAtom);

	const headerButtonClassName = clsx(`${ROOT_CLASS_NAME}__button`);
	const headerTitleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-fontsize-24',
		'controls-fontweight-medium'
	);
	const wrapperClassName = clsx(
		ROOT_CLASS_NAME,
		authAtom.role === 'user' ? `${ROOT_CLASS_NAME}_user` : `${ROOT_CLASS_NAME}_admin`
	);

	/**
	 * Обработчик клика по кнопки профиля
	 * TODO: редирект на страницу профиля
	 */
	const onProfileClick = () => {
		if (showHome && homePosition === 'left') {
			navigate('/main');
		} else {
			navigate('/profile');
		}
	};

	const onAdminClick = () => {
		if (showHome && homePosition === 'center') {
			navigate('/main');
		} else {
			navigate('/admin');
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
		<div className={wrapperClassName}>
			<Button
				className={headerButtonClassName}
				icon={
					showHome && homePosition === 'left' ? (
						<HomeIcon size={34} />
					) : (
						<ProfileIcon size={34} />
					)
				}
				onClick={onProfileClick}
			/>
			{authAtom.role === 'admin' ? (
				<Button
					className={headerButtonClassName}
					icon={
						showHome && homePosition === 'center' ? (
							<HomeIcon size={34} />
						) : (
							<AdminIcon size={46} />
						)
					}
					onClick={onAdminClick}
				/>
			) : (
				<span className={headerTitleClassName}>{userAtom.licencePlate}</span>
			)}
			<Button
				className={headerButtonClassName}
				icon={<ExitIcon size={34} />}
				onClick={onExitCLick}
			/>
		</div>
	);
};

export default Header;
