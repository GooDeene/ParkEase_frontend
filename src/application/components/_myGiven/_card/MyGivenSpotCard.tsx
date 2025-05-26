import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './MyGivenSpotCard.css';
import Button from '../../../../controls/_button/Button';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { SpotStatus } from '../types/SpotStatus';

interface IMyGivenSpotCardProps extends IPropsWithClassName {
	spotStatus: SpotStatus;
	dates: [Date | null, Date | null];
}

const ROOT_CLASS_NAME = 'myGivenSpotCard';

const MyGivenSpotCard = ({ className, spotStatus, dates }: IMyGivenSpotCardProps) => {
	const [hideAction, setHideAction] = useState(false);
	const [showTimeout, setShowTimeout] = useState<number | null>(null);
	const [title, setTitle] = useState(getDatesPeriod(dates));

	const cardClassName = clsx(ROOT_CLASS_NAME, className);
	const actionWrapperClassName = clsx(
		`${ROOT_CLASS_NAME}__actionWrapper`,
		hideAction && `${ROOT_CLASS_NAME}__actionWrapper_hidden`
	);
	const emptyActionClassName = clsx(`${ROOT_CLASS_NAME}__emptyButtonHint`);
	const actionButtonClassName = clsx(`${ROOT_CLASS_NAME}__actionButton`, 'controls-fontsize-14');
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-fontsize-18',
		hideAction && 'controls-fontweight-medium'
	);

	const onCardClick = () => {
		if (!showTimeout && dates[1]) {
			setHideAction(() => true);
			const timeout = setTimeout(() => {
				setHideAction(() => false);
				setShowTimeout(() => null);
			}, 1200);
			setShowTimeout(() => timeout);
		}
	};

	const onButtonClick = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	useEffect(() => {
		setTitle(() => getDatesPeriod(dates));
	}, dates);

	return (
		<div
			className={cardClassName}
			onClick={onCardClick}
		>
			<span className={titleClassName}>{title}</span>
			<div className={actionWrapperClassName}>
				{spotStatus === SpotStatus.Free ? (
					<Button
						className={actionButtonClassName}
						title='Отказаться'
						padding={{
							t: 's',
							r: 'xs',
							b: 's',
							l: 'xs',
						}}
						onClick={onButtonClick}
					/>
				) : (
					<span className={emptyActionClassName}>Место уже занято</span>
				)}
			</div>
		</div>
	);
};

export default MyGivenSpotCard;
