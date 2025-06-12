import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './AdminSpotUserCard.css';
import Button from '../../../../controls/_button/Button';
import { useMemo, type ReactNode } from 'react';
import UserCircleIcon from '../../../../controls/_icons/UserCircleIcon';
import CarIcon from '../../../../controls/_icons/CarIcon';
import EmailIcon from '../../../../controls/_icons/EmailIcon';
import TelegramIcon from '../../../../controls/_icons/TelegramIcon';
import type { TUser } from '../../../screens/_admin/SpotEditingScreen';

const ROOT_CLASS_NAME = 'adminSpotUserCard';

const DEFAULT_NOT_FOUND_TEXT = 'Не указано';
const DEFAULT_DESIBALED_TEXT = 'Закреплен за другим местом';

interface IAdminSpotUserCardProps extends IPropsWithClassName {
	user: TUser;
	showDeattachButton?: boolean;
	disabled?: boolean;
	rounded?: boolean;
	clickableLinks?: boolean;
	compact?: boolean;
	onClick?: (user: TUser) => void;
	onDeattach?: (user: TUser) => void;
}

interface IInfoRow extends IPropsWithClassName {
	icon: ReactNode;
	textTemplate?: ReactNode;
	text?: string | null;
}

const InfoRow = (props: IInfoRow) => {
	const rootClaaName = clsx(`${ROOT_CLASS_NAME}Row`);
	const textClassName = clsx('controls-text-ellipsis', 'controls-fontcolor-main');

	return (
		<div className={rootClaaName}>
			{props.icon}
			{props.textTemplate ?? (
				<span className={textClassName}>{props.text || DEFAULT_NOT_FOUND_TEXT}</span>
			)}
		</div>
	);
};

const getTelegramHref = (username: string) => {
	return `https://t.me/${username.charAt(0) === '@' ? username.slice(1) : username}`;
};

const AdminSpotUserCard = ({
	user,
	showDeattachButton = false,
	disabled = false,
	rounded = true,
	clickableLinks = false,
	compact = false,
	onClick,
	onDeattach,
}: IAdminSpotUserCardProps) => {
	const mainClassName = clsx(
		ROOT_CLASS_NAME,
		compact && `${ROOT_CLASS_NAME}_compact`,
		disabled && `${ROOT_CLASS_NAME}_disabled`,
		rounded && `${ROOT_CLASS_NAME}_rounded`
	);
	const iconClassName = clsx(disabled ? 'controls-fontcolor-main' : 'controls-fontcolor-accent');
	const disabledMessageClassName = clsx(
		`${ROOT_CLASS_NAME}__disabledText`,
		'controls-fontsize-10'
	);
	const iconSize = useMemo(() => (compact ? 20 : 28), [compact]);
	// const popupRef = useRef<TPopupDialogAPI>(null);

	const onDeattachClick = () => {
		onDeattach?.(user);
		// popupRef.current?.show().then((res) => {
		// 	if (res) onDeattach?.(user);
		// });
	};

	const onCardClick = () => {
		if (disabled) {
			return;
		}

		onClick?.(user);
	};

	return (
		<>
			{/* <PopupDialog
				ref={popupRef}
				title='Уверены, что хотите отвязать пользователя от парковочного места?'
				detail='Это приведет к сбросу всех уступленных и занятых периодов этого места'
				showCommitButton
				showRejectButton
			/> */}
			<div
				className={mainClassName}
				onClick={onCardClick}
			>
				<InfoRow
					icon={
						<UserCircleIcon
							className={iconClassName}
							size={iconSize}
						/>
					}
					text={user.fullName}
				/>
				<InfoRow
					icon={
						<CarIcon
							className={iconClassName}
							size={iconSize}
						/>
					}
					text={user.licencePlate}
				/>
				<InfoRow
					icon={
						<EmailIcon
							className={iconClassName}
							size={iconSize}
						/>
					}
					textTemplate={
						clickableLinks ? (
							<a
								href={`mailto:${user.email}`}
								target='_blank'
								className='controls-text-ellipsis'
							>
								{user.email}
							</a>
						) : null
					}
					text={user.email}
				/>
				<InfoRow
					icon={
						<TelegramIcon
							className={iconClassName}
							size={iconSize}
						/>
					}
					textTemplate={
						clickableLinks && user.telegram ? (
							<a
								href={getTelegramHref(user.telegram || '')}
								target='_blank'
								className='controls-text-ellipsis'
							>
								{user.telegram}
							</a>
						) : null
					}
					text={user.telegram}
				/>
				{disabled && (
					<span className={disabledMessageClassName}>{DEFAULT_DESIBALED_TEXT}</span>
				)}
				{showDeattachButton && (
					<Button
						title='Отвязать'
						color='error'
						backgroundColor='white'
						showBorder
						padding={{
							t: '3xs',
							r: '4xs',
							b: '3xs',
							l: '4xs',
						}}
						onClick={onDeattachClick}
					/>
				)}
			</div>
		</>
	);
};

export default AdminSpotUserCard;
