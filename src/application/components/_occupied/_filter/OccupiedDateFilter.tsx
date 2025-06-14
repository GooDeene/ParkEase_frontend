import clsx from 'clsx';
import './OccupiedDateFilter.css';
import Datepicker from '../../../../controls/_datepicker/Datepicker';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import { getDatePeriodTitle } from '../../../../controls/utils/getDatePeriodTitle';
import ReloadButton from '../../_reloadButton/ReloadButton';
import { useRecoilState } from 'recoil';
import { MainFilterAtom } from '../../../core/state/MainFilterAtom';
import type { TPeriod } from '../../../screens/_giveUp/GiveUpScreen';

const ROOT_CLASS_NAME = 'occupiedDateFilter';

interface IOccupiedDateFilterProps extends IPropsWithClassName {
	excludedIntervals: TPeriod[];
}

const OccupiedDateFilter = ({ className, excludedIntervals }: IOccupiedDateFilterProps) => {
	const [mainFilterAtom, setMainFilterAtom] = useRecoilState(MainFilterAtom);
	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const headerClassName = clsx(`${ROOT_CLASS_NAME}__header`);

	const onFilterSet = (start: Date | null, end: Date | null) => {
		// if (mainFilterAtom.start !== start && mainFilterAtom.end !== end) {
		setMainFilterAtom(() => {
			return {
				start,
				end,
			};
		});
	};

	return (
		<div className={wrapperClassName}>
			<div className={headerClassName}>
				<span>{`Свободные на ${getDatePeriodTitle(
					mainFilterAtom.start,
					mainFilterAtom.end
				)}`}</span>
				<ReloadButton />
			</div>
			<Datepicker
				startDate={mainFilterAtom.start}
				endDate={mainFilterAtom.end}
				excludeDateIntervals={excludedIntervals}
				onSelectionComplete={onFilterSet}
			/>
		</div>
	);
};

export default OccupiedDateFilter;
