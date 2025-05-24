import clsx from 'clsx';
import './OccupiedDateFilter.css';
import Datepicker from '../../../../controls/_datepicker/Datepicker';
import { useState } from 'react';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import { getDatePeriodTitle } from '../../../../controls/utils/getDatePeriodTitle';
import ReloadButton from '../../_reloadButton/ReloadButton';

interface IOccupiedDateFilterProps extends IPropsWithClassName {
	onValueChanged?: (startDate: Date | null, endDate: Date | null) => void;
}

const ROOT_CLASS_NAME = 'occupiedDateFilter';

const OccupiedDateFilter = ({ onValueChanged, className }: IOccupiedDateFilterProps) => {
	const [selectedStart, setSelectedStart] = useState<Date | null>(new Date());
	const [selectedEnd, setSelectedEnd] = useState<Date | null>(new Date());
	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const headerClassName = clsx(`${ROOT_CLASS_NAME}__header`);

	const onFilterSet = (start: Date | null, end: Date | null) => {
		if (selectedStart !== start && selectedEnd !== end) {
			setSelectedStart(() => start);
			setSelectedEnd(() => end);

			onValueChanged?.(start, end);

			console.log(`${start} \n ${end}`);
		}
	};

	return (
		<div className={wrapperClassName}>
			<div className={headerClassName}>
				<span>{`На ${getDatePeriodTitle(selectedStart, selectedEnd)}`}</span>
				<ReloadButton />
			</div>
			<Datepicker
				startDate={selectedStart}
				endDate={selectedEnd}
				onSelectionComplete={onFilterSet}
			/>
		</div>
	);
};

export default OccupiedDateFilter;
