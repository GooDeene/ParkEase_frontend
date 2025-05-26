import clsx from 'clsx';
import './OccupiedCard.css';
import Button from '../../../../controls/_button/Button';
import type { SyntheticEvent } from 'react';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import { getDatePeriodTitle } from '../../../../controls/utils/getDatePeriodTitle';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';

interface IOccupiedCard {
	item: IParkingSpot;

	onCardClick?: (item: IParkingSpot) => void;
}

const getFirstRow = (
	dates: [IParkingSpot['startDate'], IParkingSpot['endDate']],
	spotName: IParkingSpot['spotName']
): string => {
	const result = ['Место', `${spotName},`, 'на', getDatePeriodTitle(dates[0], dates[1])];

	return result.join(' ').trim();
};

const ROOT_CLASS_NAME = 'occupiedCard';

const OccupiedCard = ({ item, onCardClick: externalOnCardClick }: IOccupiedCard) => {
	const textBlockClassName = clsx(`${ROOT_CLASS_NAME}__textBlock`);
	const textClassName = clsx('controls-text-ellipsis');

	/**
	 * Обработчик клика по всей карточке места.
	 */
	const onCardClick = () => {
		externalOnCardClick?.(item);
	};

	/**
	 * Обработчик клика по кнопке отмены брони места.
	 */
	const onDiscardClick = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	return (
		<div
			className={ROOT_CLASS_NAME}
			onClick={onCardClick}
		>
			<div className={textBlockClassName}>
				<span className={textClassName}>
					{getFirstRow([item.startDate, item.endDate], item.spotName)}
				</span>
				<span className={textClassName}>
					{getDatesPeriod([item.startDate, item.endDate])}
				</span>
			</div>
			<Button
				className='controls-fontsize-14'
				padding={{ t: 'm', r: '2xs', b: 'm', l: '2xs' }}
				title='Отказаться'
				onClick={onDiscardClick}
			/>
		</div>
	);
};

export default OccupiedCard;
