import clsx from 'clsx';
import './OccupiedCard.css';
import Button from '../../../../controls/_button/Button';
import { formatDateToRU } from '../../../../controls/utils/formatDate';
import type { SyntheticEvent } from 'react';

interface IOccupiedCard {
	dates: [Date | null, Date | null];
	spotName: string;
}

const getFirstRow = (
	dates: IOccupiedCard['dates'],
	spotName: IOccupiedCard['spotName']
): string => {
	const result = ['Место', `${spotName},`, 'на'];

	if (!dates[1]) {
		result.push('дату');
	} else {
		result.push('период');
	}

	return result.join(' ').trim();
};

const getSecondRow = (dates: IOccupiedCard['dates']): string => {
	if (dates[1] && dates[0]) {
		return `${formatDateToRU(dates[0])} — ${formatDateToRU(dates[1])}`;
	} else if (dates[0]) {
		return formatDateToRU(dates[0]);
	}

	return '';
};

/**
 * Обработчик клика по всей карточке места.
 */
const onCardClick = () => {
};

/**
 * Обработчик клика по кнопке отмены брони места.
 */
const onDiscardClick = (event: SyntheticEvent) => {
	event.stopPropagation();
};

const OccupiedCard = ({ dates, spotName }: IOccupiedCard) => {
	const rootClassName = clsx('occupiedCard');
	const textBlockClassName = clsx(`${rootClassName}__textBlock`);
	const textClassName = clsx(`${rootClassName}__textRow`);

	return (
		<div
			className={rootClassName}
			onClick={onCardClick}
		>
			<div className={textBlockClassName}>
				<span className={textClassName}>{getFirstRow(dates, spotName)}</span>
				<span className={textClassName}>{getSecondRow(dates)}</span>
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
