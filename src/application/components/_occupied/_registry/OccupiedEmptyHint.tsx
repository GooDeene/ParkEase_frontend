import clsx from 'clsx';
import './OccupiedEmptyHint.css';

const ROOT_CLASS_NAME = 'occupiedEmptyHint';

const OccupiedEmptyHint = () => {
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-margin_bottom-l',
		'controls-fontsize-20'
	);
	const detailClassName = clsx(`${ROOT_CLASS_NAME}__detail`, 'controls-fontsize-14');

	return (
		<div className={ROOT_CLASS_NAME}>
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
