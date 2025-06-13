import clsx from 'clsx';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import type { ISpotOwner } from '../types/ISpotOwner';
import TelegramIcon from '../_icons/TelegramIcon';
import './OwnerCard.css';
import UserCircleIcon from '../_icons/UserCircleIcon';
import EmailIcon from '../_icons/EmailIcon';

interface IOwnerCardProps extends IPropsWithClassName {
	item: ISpotOwner;
	title?: string;
	clickableLinks?: boolean;

	onContactClick?: (contactType: 'phone' | 'telegram') => void;
}

const DEFAULT_TITLE = 'Владелец';
const DEAFULT_CONTACT_NOT_SPECIFIED = 'Не указан';

const ROOT_CLASS_NAME = 'controls-ownerCard';

const getTelegramHref = (username: string) => {
	return `https://t.me/${username.charAt(0) === '@' ? username.slice(1) : username}`;
};

const OwnerCard = ({
	className,
	item: { telegram, email, fullName },
	title,
	clickableLinks = true,
	onContactClick: clickHandler,
}: IOwnerCardProps) => {
	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const titleClassName = clsx(`${ROOT_CLASS_NAME}__title`, 'controls-margin_bottom-3xs');
	const contentClassName = clsx(`${ROOT_CLASS_NAME}__content`, 'controls-text-ellipsis');
	const iconClassName = clsx(`${ROOT_CLASS_NAME}__icon`);
	const contactClassName = clsx(`${ROOT_CLASS_NAME}__contact`, 'controls-fontsize-14');

	const onContactClick = (contactType: 'telegram' | 'phone') => {
		clickHandler?.(contactType);
	};

	return (
		<div className={wrapperClassName}>
			<div className={titleClassName}>{title || DEFAULT_TITLE}</div>
			<div className={contentClassName}>
				<div className={clsx(contactClassName, 'controls-margin_bottom-xs')}>
					<UserCircleIcon
						className={iconClassName}
						size={24}
						color='var(--colors_accent)'
					/>
					{fullName && clickableLinks ? (
						<a
							target='_blank'
							href={`tel:${fullName}`}
							className='controls-text-ellipsis'
							onClick={() => onContactClick('phone')}
						>
							{fullName}
						</a>
					) : (
						<span className='controls-text-ellipsis'>
							{DEAFULT_CONTACT_NOT_SPECIFIED}
						</span>
					)}
				</div>
				<div className={clsx(contactClassName, 'controls-margin_bottom-xs')}>
					<TelegramIcon
						className={iconClassName}
						size={24}
						color='var(--colors_accent)'
					/>
					{telegram && clickableLinks ? (
						<a
							target='_blank'
							href={getTelegramHref(telegram)}
							className='controls-text-ellipsis'
							onClick={() => onContactClick('telegram')}
						>
							{telegram}
						</a>
					) : (
						<span className='controls-text-ellipsis'>
							{DEAFULT_CONTACT_NOT_SPECIFIED}
						</span>
					)}
				</div>
				<div className={clsx(contactClassName)}>
					<EmailIcon
						className={iconClassName}
						size={24}
						color='var(--colors_accent)'
					/>
					{email && clickableLinks ? (
						<a
							target='_blank'
							href={`mailto:${email}`}
							className='controls-text-ellipsis'
							onClick={() => onContactClick('telegram')}
						>
							{email}
						</a>
					) : (
						<span className='controls-text-ellipsis'>
							{DEAFULT_CONTACT_NOT_SPECIFIED}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default OwnerCard;
