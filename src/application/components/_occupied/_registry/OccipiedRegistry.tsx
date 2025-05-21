import clsx from 'clsx';
import './OccupiedRegistry.css';
import OccupiedCard from '../_card/OccupiedCard';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';

interface IOccupiedRegistryProps extends IPropsWithClassName {
	className?: string;
	items: IParkingSpot[];
	showBottomSeparator?: boolean;
}

const OccipiedRegistry = ({ items, showBottomSeparator = false }: IOccupiedRegistryProps) => {
	const rootClassName = clsx('occupiedRegistry');
	const cardsClassName = clsx(`${rootClassName}__cards`);
	const separatorClassName = clsx(`${rootClassName}__separator`);
	const titleClassName = clsx(
		`${rootClassName}__title`,
		'cotnrols-fontsize-20',
		'controls-margin_bottom-l'
	);

	return (
		<div className={rootClassName}>
			<div className={titleClassName}>Уже занятые мной</div>
			<div className={cardsClassName}>
				{items.map((item) => {
					return (
						<OccupiedCard
							key={item.id}
							dates={[item.startDate, item.endDate]}
							spotName={item.spotName}
						/>
					);
				})}
				{showBottomSeparator && <div className={separatorClassName} />}
			</div>
		</div>
	);
};

export default OccipiedRegistry;
