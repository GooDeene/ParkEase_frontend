import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import MyGivenSpotCard from '../_card/MyGivenSpotCard';
import type { SpotStatus } from '../types/SpotStatus';
import './MyGivenSpotRegistry.css';
import Button from '../../../../controls/_button/Button';
import ReloadIcon from '../../../../controls/_icons/ReloadIcon';
import EmptyHint from '../../../../controls/_emptyHint/EmptyHint';

type TMyGivenSpotRecord = {
	id: string;
	spotName: string;
	startDate: Date | null;
	endDate: Date | null;
	status: SpotStatus;
};

interface IMyGivenSpotRegistryProps extends IPropsWithClassName {
	items: TMyGivenSpotRecord[];
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
						<Button icon={<ReloadIcon size={30} />} />
					</div>
					<div className={cardsClassName}>
						{items.map((item) => {
							return (
								<MyGivenSpotCard
									key={item.id}
									dates={[item.startDate, item.endDate]}
									spotStatus={item.status}
								/>
							);
						})}
					</div>
				</>
			) : (
				<EmptyHint
					title='Когда вы уступите место, запись об этом появится здесь'
					detail='Если планы поменялись, можно отказаться от сдачи места, но только пока его не заняли'
					igmSrc='/src/assets/yes_park_sign.png'
				/>
			)}
		</div>
	);
};

export default MyGivenSpotRegistry;
