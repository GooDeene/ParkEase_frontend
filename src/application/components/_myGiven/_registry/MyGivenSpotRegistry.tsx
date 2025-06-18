import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import MyGivenSpotCard from '../_card/MyGivenSpotCard';
import './MyGivenSpotRegistry.css';
import EmptyHint from '../../../../controls/_emptyHint/EmptyHint';
import ParkSign from '/src/assets/yes_park_sign.png';
import { type ILease } from '../../../core/state/MyLeases';
import InnerLoader from '../../_innerLoader/InnerLoader';

interface IMyGivenSpotRegistryProps extends IPropsWithClassName {
	items: ILease[];
	loading?: boolean;
	onReloadClick?: () => void;
}

const ROOT_CLASS_NAME = 'myGivenSpotRegistry';

const MyGivenSpotRegistry = ({
	items,
	className,
	loading = false
}: IMyGivenSpotRegistryProps) => {
	const mainClassName = clsx(ROOT_CLASS_NAME, className);
	const headerClassName = clsx(`${ROOT_CLASS_NAME}__header`);
	const cardsClassName = clsx(`${ROOT_CLASS_NAME}__cards`);

	return (
		<div className={mainClassName}>
			{items.length ? (
				<>
					<div className={headerClassName}>
						<span>Предоставленные периоды</span>
						{/* <ReloadButton onClick={onReloadClick} /> */}
					</div>
					<div className={cardsClassName}>
						{loading ? (
							<InnerLoader
								style='dark'
								height={200}
							/>
						) : (
							items.map((item) => {
								return (
									<MyGivenSpotCard
										key={item.id}
										item={item}
									/>
								);
							})
						)}
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
