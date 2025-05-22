import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../controls/types/IPropsWithClassName';
import Button from '../../../controls/_button/Button';
import type { SyntheticEvent } from 'react';
import { formatDateToRU } from '../../../controls/utils/formatDate';
import { getTomorrowDate } from '../../../controls/utils/getTomorrowDate';
import './MySpotCard.css';

interface IMySpotCard extends IPropsWithClassName {
	spotName?: string;
}

const ROOT_CLASS_NAME = 'mySpotCard';

const DEFAULT_EMPTY_TITLE = 'У вас нет постоянного парковочного места';
const DEFAULT_EMPTY_DETAIL = 'Получите его у администратора парковки вашего офиса';

const MySpotCard = ({ className, spotName }: IMySpotCard) => {
	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const spotNameClassName = clsx('controls-fontsize-40', 'controls-fontweight-medium');
	const giveUpButtonClassName = clsx(`${ROOT_CLASS_NAME}__giveUpButton`, 'controls-fontsize-14');
	const spotInfoBlockClassName = clsx(`${ROOT_CLASS_NAME}__spotInfoBlock`);
	const buttonContentClassName = clsx(`${ROOT_CLASS_NAME}__giveUpButtonContent`);

	const emptyHintClassName = clsx(`${ROOT_CLASS_NAME}__emptyHint`);
	const emptyDetailClassName = clsx(
		`${ROOT_CLASS_NAME}__emptyHintDetail`,
		'controls-fontsize-14'
	);

	const onCardClick = () => {
		console.log('card click');
	};

	const onButtonClick = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	return (
		<div
			onClick={onCardClick}
			className={wrapperClassName}
		>
			{spotName && spotName !== '' ? (
				<>
					<div className={spotInfoBlockClassName}>
						<span className={clsx('controls-fontsize-20', 'controls-text-ellipsis')}>
							Ваше место
						</span>
						<span className={spotNameClassName}>{spotName}</span>
					</div>
					<Button
						className={giveUpButtonClassName}
						title={
							<div className={buttonContentClassName}>
								<span>Уступить</span>
								<span className='controls-margin_bottom-s'>на завтра</span>
								<span>{`(${formatDateToRU(getTomorrowDate())})`}</span>
							</div>
						}
						onClick={onButtonClick}
					/>
				</>
			) : (
				<div className={emptyHintClassName}>
					<span className='controls-fontsize-20'>{DEFAULT_EMPTY_TITLE}</span>
					<span className={emptyDetailClassName}>{DEFAULT_EMPTY_DETAIL}</span>
				</div>
			)}
		</div>
	);
};

export default MySpotCard;
