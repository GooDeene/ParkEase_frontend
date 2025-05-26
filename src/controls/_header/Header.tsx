import clsx from 'clsx';
import './Header.css';
import Button from '../_button/Button';
import ProfileIcon from '../_icons/ProfileIcon';
import ExitIcon from '../_icons/ExitIcon';
import { useState } from 'react';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import HomeIcon from '../_icons/HomeIcon';

interface IHeaderProps extends IPropsWithClassName {
	showHome?: boolean;
}

const ROOT_CLASS_NAME = 'controls-header';

const Header = ({ showHome = false }: IHeaderProps) => {
	const [title] = useState('А123АА123');

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
	const onProfileClick = () => {};

	const onExitCLick = () => {};

	return (
		<div className={ROOT_CLASS_NAME}>
			<Button
				className={headerButtonClassName}
				icon={showHome ? <HomeIcon size={40} /> : <ProfileIcon size={40} />}
				onClick={onProfileClick}
			/>
			<span className={headerTitleClassName}>{title}</span>
			<Button
				className={headerButtonClassName}
				icon={<ExitIcon size={40} />}
				onClick={onExitCLick}
			/>
		</div>
	);
};

export default Header;
