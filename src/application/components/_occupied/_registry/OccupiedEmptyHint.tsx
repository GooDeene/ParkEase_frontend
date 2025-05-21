import clsx from 'clsx';
import './OccupiedEmptyHint.css';

const OccupiedEmptyHint = () => {
	const rootClassName = clsx('occupiedEmptyHint');
	const titleClassName = clsx(
		`${rootClassName}__title`,
		'controls-margin_bottom-l',
		'controls-fontsize-20'
	);
	const detailClassName = clsx(`${rootClassName}__detail`, 'controls-fontsize-14');

	return (
		<div className={rootClassName}>
			<img
				className='controls-margin_bottom-3xl'
				src='src/assets/no_park_sign.png'
			/>
			<span className={titleClassName}>На выбранные даты не нашлось свободных мест</span>
			<span className={detailClassName}>Попробуйте изменить или сбросить диапазон дат</span>
		</div>
	);
};

export default OccupiedEmptyHint;
