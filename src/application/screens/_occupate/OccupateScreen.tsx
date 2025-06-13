import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import OwnerCard from '../../../controls/_ownerCard/OwnerCard';
import './OccupateScreen.css';
import Datepicker from '../../../controls/_datepicker/Datepicker';
import Button from '../../../controls/_button/Button';
import { useState } from 'react';
import { getDatePeriodTitle } from '../../../controls/utils/getDatePeriodTitle';

const ROOT_CLASS_NAME = 'occupateScreen';

const spotName = '212';

const OccupateScreen = () => {
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const infoBlocksClassName = clsx(`${ROOT_CLASS_NAME}__infoBlocks`);
	const spotNameClassName = clsx(`${ROOT_CLASS_NAME}__spotNameWrapper`);
	const spotBlockClassName = clsx(`${ROOT_CLASS_NAME}__spotBlock`, 'controls-fontsize-40');
	const datepickerBlockClassName = clsx(
		`${ROOT_CLASS_NAME}__datepickerBlock`,
		'controls-margin_top-l'
	);
	const submitButtonClassName = clsx(`${ROOT_CLASS_NAME}__submitButton`);

	return (
		<div>
			<Header showHome />
			<ScreenLayout>
				<div className={infoBlocksClassName}>
					<div className={spotNameClassName}>
						<div className='controls-margin_bottom-3xs'>Занять</div>
						<div className={spotBlockClassName}>{spotName}</div>
					</div>
					<OwnerCard
						item={{
							email: 'avada@kedavra.gmail.com',
							fullName: 'Лорд Волдеморт',
							telegram: '@avada.kedavra',
						}}
					/>
				</div>
				<div className={datepickerBlockClassName}>
					<div className='controls-margin_bottom-3xs'>{`На ${getDatePeriodTitle(
						startDate,
						endDate
					)}`}</div>
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
					title='Занять'
					disabled={startDate === null}
				/>
			</ScreenLayout>
		</div>
	);
};

export default OccupateScreen;
