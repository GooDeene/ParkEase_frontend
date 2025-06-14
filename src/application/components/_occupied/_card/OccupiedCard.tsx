import clsx from 'clsx';
import './OccupiedCard.css';
import Button from '../../../../controls/_button/Button';
import type { SyntheticEvent } from 'react';
import { getDatePeriodTitle } from '../../../../controls/utils/getDatePeriodTitle';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import { BookingsAtom, type IBooking } from '../../../core/state/BookingsAtom';
import { useLoading } from '../../../core/utils/useLoading';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';

interface IOccupiedCard {
	item: IBooking;

	onCardClick?: (item: IBooking) => void;
}

const getFirstRow = (
	dates: [IBooking['startDate'], IBooking['endDate']],
	spotName: IBooking['parkingSpotName']
): string => {
	const result = ['Место', `${spotName},`, 'на', getDatePeriodTitle(dates[0], dates[1])];

	return result.join(' ').trim();
};

const ROOT_CLASS_NAME = 'occupiedCard';

const OccupiedCard = ({ item, onCardClick: externalOnCardClick }: IOccupiedCard) => {
	const textBlockClassName = clsx(`${ROOT_CLASS_NAME}__textBlock`);
	const textClassName = clsx('controls-text-ellipsis');
	const setBookingsAtom = useSetRecoilState(BookingsAtom);
	const { loading, runProcess } = useLoading();

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
		runProcess(() => {
			return deleteDoc(doc(db, 'bookings', item.id));
		}).then(() => {
			toast(
				`Бронирование места ${item.parkingSpotName} на ${getDatePeriodTitle(
					item.startDate,
					item.endDate
				)} ${getDatesPeriod([item.startDate, item.endDate])} отменено`,
				{
					type: 'success',
					autoClose: 3500,
				}
			);

			setBookingsAtom((prev) => {
				const res = [...prev];

				const index = prev.findIndex((booking) => item.id === booking.id);

				if (index !== -1) {
					return [...prev.slice(0, index), ...prev.slice(index + 1)];
				}

				return res;
			});
		});
		event.stopPropagation();
	};

	return (
		<div
			className={ROOT_CLASS_NAME}
			onClick={onCardClick}
		>
			<div className={textBlockClassName}>
				<span className={textClassName}>
					{getFirstRow([item.startDate, item.endDate], item.parkingSpotName)}
				</span>
				<span className={textClassName}>
					{getDatesPeriod([item.startDate, item.endDate])}
				</span>
			</div>
			<div className={clsx(`${ROOT_CLASS_NAME}__buttonWrapper`)}>
				<Button
					className='controls-fontsize-14'
					padding={{ t: 'm', r: '2xs', b: 'm', l: '2xs' }}
					title='Отказаться'
					onClick={onDiscardClick}
					loading={loading}
					loaderHeight={45}
					fullWidth
				/>
			</div>
		</div>
	);
};

export default OccupiedCard;
