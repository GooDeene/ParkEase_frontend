import clsx from 'clsx';
import './Header.css';
import Button from '../_button/Button';
import ProfileIcon from '../_icons/ProfileIcon';
import ExitIcon from '../_icons/ExitIcon';
import { useState } from 'react';

const Header = () => {
	const [title, setTitle] = useState('А123АА123');

	const rootClassName = clsx('controls-header');
	const headerButtonClassName = clsx(`${rootClassName}__button`);
	const headerTitleClassName = clsx(
		`${rootClassName}__title`,
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
		<div className={rootClassName}>
			<Button
				className={headerButtonClassName}
				icon={<ProfileIcon />}
				onClick={onProfileClick}
			/>
			<span className={headerTitleClassName}>{title}</span>
			<Button
				className={headerButtonClassName}
				icon={<ExitIcon />}
				onClick={onExitCLick}
			/>
		</div>
	);
};

export default Header;
