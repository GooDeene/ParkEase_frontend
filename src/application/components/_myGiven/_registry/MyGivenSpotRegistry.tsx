import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import MyGivenSpotCard from '../_card/MyGivenSpotCard';
import { SpotStatus } from '../types/SpotStatus';
import './MyGivenSpotRegistry.css';
import EmptyHint from '../../../../controls/_emptyHint/EmptyHint';
import ReloadButton from '../../_reloadButton/ReloadButton';
import ParkSign from '/src/assets/yes_park_sign.png';
import type { ILease } from '../../../core/state/MyLeases';

interface IMyGivenSpotRegistryProps extends IPropsWithClassName {
	items: ILease[];
}

const ROOT_CLASS_NAME = 'myGivenSpotRegistry';

const MyGivenSpotRegistry = ({ items, className }: IMyGivenSpotRegistryProps) => {
	const mainClassName = clsx(ROOT_CLASS_NAME, className);
	const headerClassName = clsx(`${ROOT_CLASS_NAME}__header`);
	const cardsClassName = clsx(`${ROOT_CLASS_NAME}__cards`);

	return (
		<div className={mainClassName}>
			{items.length ? (
				<>
					<div className={headerClassName}>
						<span>Предоставленные периоды</span>
						<ReloadButton />
					</div>
					<div className={cardsClassName}>
						{items.map((item) => {
							return (
								<MyGivenSpotCard
									key={item.id}
									dates={[item.startDate, item.endDate]}
									spotStatus={SpotStatus.Occupied}
								/>
							);
						})}
					</div>
				</>
			) : (
				<EmptyHint
					title='Когда вы уступите место, запись об этом появится здесь'
					detail='Если планы поменялись, можно отказаться от сдачи места, но только пока его не заняли'
					igmSrc={ParkSign}
				/>
			)}
		</div>
	);
};

export default MyGivenSpotRegistry;
