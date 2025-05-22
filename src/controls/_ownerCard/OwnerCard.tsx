import clsx from 'clsx';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import type { ISpotOwner } from '../types/ISpotOwner';
import PhoneIcon from '../_icons/PhoneIcon';
import TelegramIcon from '../_icons/TelegramIcon';
import './OwnerCard.css';

interface IOwnerCardProps extends IPropsWithClassName {
	item: ISpotOwner;
	title?: string;
	clickableLinks?: boolean;
}

const DEFAULT_TITLE = 'Владелец';
const DEAFULT_CONTACT_NOT_SPECIFIED = 'Не указан';

const ROOT_CLASS_NAME = 'controls-ownerCard';

const getTelegramHref = (username: string) => {
	return `https://t.me/${username.charAt(0) === '@' ? username.slice(1) : username}`;
};

const OwnerCard = ({
	className,
	item: { telegram, phone },
	title,
	clickableLinks = true,
}: IOwnerCardProps) => {
	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const titleClassName = clsx(`${ROOT_CLASS_NAME}__title`, 'controls-margin_bottom-3xs');
	const contentClassName = clsx(`${ROOT_CLASS_NAME}__content`, 'controls-font-ellipsis');
	const iconClassName = clsx(`${ROOT_CLASS_NAME}__icon`);
	const contactClassName = clsx(`${ROOT_CLASS_NAME}__contact`, 'controls-fontsize-14');

	const onContactClick = (contactType: 'telegram' | 'phone') => {};

	return (
		<div className={wrapperClassName}>
			<div className={titleClassName}>{title || DEFAULT_TITLE}</div>
			<div className={contentClassName}>
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
				<div className={contactClassName}>
					<PhoneIcon
						className={iconClassName}
						size={24}
						color='var(--colors_accent)'
					/>
					{phone && clickableLinks ? (
						<a
							target='_blank'
							href={`tel:${phone}`}
							className='controls-text-ellipsis'
							onClick={() => onContactClick('phone')}
						>
							{phone}
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
