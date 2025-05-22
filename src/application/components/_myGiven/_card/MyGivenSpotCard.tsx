import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './MyGivenSpotCard.css';
import Button from '../../../../controls/_button/Button';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import { useEffect, useState } from 'react';
import { SpotStatus } from '../types/SpotStatus';

interface IMyGivenSpotCardProps extends IPropsWithClassName {
	spotStatus: SpotStatus;
	dates: [Date | null, Date | null];
}

const ROOT_CLASS_NAME = 'myGivenSpotCard';

const MyGivenSpotCard = ({ className, spotStatus, dates }: IMyGivenSpotCardProps) => {
	const [title, setTitle] = useState(getDatesPeriod(dates));

	const cardClassName = clsx(ROOT_CLASS_NAME, className);
	const actionWrapperClassName = clsx(`${ROOT_CLASS_NAME}__actionWrapper`);
	const emptyActionClassName = clsx(`${ROOT_CLASS_NAME}__emptyButtonHint`);
	const actionButtonClassName = clsx(`${ROOT_CLASS_NAME}__actionButton`, 'controls-fontsize-14');
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-fontsize-18',
		'controls-margin_right-3xs'
	);

	useEffect(() => {
		setTitle(() => getDatesPeriod(dates));
	}, dates);

	return (
		<div className={cardClassName}>
			<span className={titleClassName}>{title}</span>
			<div className={actionWrapperClassName}>
				{spotStatus === SpotStatus.Free ? (
					<Button
						className={actionButtonClassName}
						title='Отказаться'
						padding={{
							t: 's',
							r: '2xs',
							b: 's',
							l: '2xs',
						}}
					/>
				) : (
					<span className={emptyActionClassName}>Место уже занято</span>
				)}
			</div>
		</div>
	);
};

export default MyGivenSpotCard;
