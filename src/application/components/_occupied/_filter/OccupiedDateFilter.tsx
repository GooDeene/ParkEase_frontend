import clsx from 'clsx';
import './OccupiedDateFilter.css';
import Button from '../../../../controls/_button/Button';
import ReloadIcon from '../../../../controls/_icons/ReloadIcon';
import Datepicker from '../../../../controls/_datepicker/Datepicker';
import { useState } from 'react';

interface IOccupiedDateFilterProps {
	onValueChanged?: (startDate: Date | null, endDate: Date | null) => void;
}

const OccupiedDateFilter = ({ onValueChanged }: IOccupiedDateFilterProps) => {
	const [selectedStart, setSelectedStart] = useState<Date | null>(new Date());
	const [selectedEnd, setSelectedEnd] = useState<Date | null>(new Date());
	const rootClassName = clsx('occupiedDateFilter');
	const headerClassName = clsx(`${rootClassName}__header`);

	const onFilterSet = (start: Date | null, end: Date | null) => {
		if (selectedStart !== start && selectedEnd !== end) {
			setSelectedStart(() => start);
			setSelectedEnd(() => end);

			onValueChanged?.(start, end);

			console.log(`${start} \n ${end}`);
		}
	};

	return (
		<div className={rootClassName}>
			<div className={headerClassName}>
				<span>Выбрать на период</span>
				<Button icon={<ReloadIcon size={30} />} />
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
