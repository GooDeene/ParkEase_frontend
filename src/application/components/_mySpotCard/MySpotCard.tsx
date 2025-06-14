import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../controls/types/IPropsWithClassName';
import Button from '../../../controls/_button/Button';
import type { SyntheticEvent } from 'react';
import { formatDateToRU } from '../../../controls/utils/formatDateToRU';
import { getTomorrowDate } from '../../../controls/utils/getTomorrowDate';
import './MySpotCard.css';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { MySpotAtom } from '../../core/state/MySpotAtom';

interface IMySpotCard extends IPropsWithClassName {
	spotName?: string;
}

const ROOT_CLASS_NAME = 'mySpotCard';

const DEFAULT_EMPTY_TITLE = 'У вас нет постоянного парковочного места';
const DEFAULT_EMPTY_DETAIL = 'Получите его у администратора парковки вашего офиса';

const MySpotCard = ({ className }: IMySpotCard) => {
	const navigate = useNavigate();

	const mySpotAtom = useRecoilValue(MySpotAtom);

	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const spotNameClassName = clsx('controls-fontsize-40', 'controls-fontweight-medium');
	const giveUpButtonClassName = clsx(`${ROOT_CLASS_NAME}__giveUpButton`, 'controls-fontsize-14');
	const spotInfoBlockClassName = clsx(`${ROOT_CLASS_NAME}__spotInfoBlock`);
	const buttonContentClassName = clsx(`${ROOT_CLASS_NAME}__giveUpButtonContent`);
	const buttonsWrapperClassName = clsx(`${ROOT_CLASS_NAME}__buttonsWrapper`);
	const emptyHintClassName = clsx(`${ROOT_CLASS_NAME}__emptyHint`);
	const emptyDetailClassName = clsx(
		`${ROOT_CLASS_NAME}__emptyHintDetail`,
		'controls-fontsize-14'
	);

	const onTomorrowClick = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	const onPeriodClick = () => {
		navigate(`/give-up`);
	};

	return (
		<div className={wrapperClassName}>
			{mySpotAtom.name && mySpotAtom.name !== '' ? (
				<>
					<div className={spotInfoBlockClassName}>
						<span className={clsx('controls-fontsize-20', 'controls-text-ellipsis')}>
							Ваше место
						</span>
						<span className={spotNameClassName}>{mySpotAtom.name}</span>
						<span className={clsx('controls-fontsize-20', 'controls-text-ellipsis')}>
							устпите его
						</span>
					</div>
					<div className={buttonsWrapperClassName}>
						<Button
							className={giveUpButtonClassName}
							title={
								<div className={buttonContentClassName}>
									<span>На завтра</span>
									<span>{`(${formatDateToRU(getTomorrowDate())})`}</span>
								</div>
							}
							onClick={onTomorrowClick}
						/>
						<Button
							className={giveUpButtonClassName}
							title={
								<div className={buttonContentClassName}>
									<span>На другой</span>
									<span>период</span>
								</div>
							}
							onClick={onPeriodClick}
						/>
					</div>
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
