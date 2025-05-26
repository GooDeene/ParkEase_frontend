import clsx from 'clsx';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import './GiveUpScreen.css';
import Header from '../../../controls/_header/Header';
import { useState } from 'react';
import { getDatePeriodTitle } from '../../../controls/utils/getDatePeriodTitle';
import Datepicker from '../../../controls/_datepicker/Datepicker';
import Button from '../../../controls/_button/Button';
import Title from '../../../controls/_title/Title';

const spotName = '12A';

const ROOT_CLASS_NAME = 'giveUpScreen';

const GiveUpScreen = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const submitButtonClassName = clsx(`${ROOT_CLASS_NAME}__submitButton`);

	return (
		<div>
			<Header showHome />
			<ScreenLayout>
				<Title text={`Уступить место ${spotName}`} />
				<div className={clsx('controls-margin_top-l', 'controls-fontcolor-main')}>
					<span className={clsx('controls-margin_bottom-3xs')}>{`На ${getDatePeriodTitle(
						startDate,
						endDate
					)}`}</span>
					<Datepicker
						calendarClassName='controls-margin_top-l'
						startDate={startDate}
						endDate={endDate}
						onSelectionComplete={(start, end) => {
							setStartDate(() => start);
							setEndDate(() => end);
						}}
						inline
					/>
				</div>
				<Button
					className={submitButtonClassName}
					title='Уступить'
					disabled={startDate === null}
				/>
			</ScreenLayout>
		</div>
	);
};

export default GiveUpScreen;
