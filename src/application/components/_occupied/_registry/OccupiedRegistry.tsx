import clsx from 'clsx';
import './OccupiedRegistry.css';
import OccupiedCard from '../_card/OccupiedCard';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import OccupiedDialog, { type OccupiedDialogAPI } from '../_dialog/OccupiedDialog';
import { useRef } from 'react';

interface IOccupiedRegistryProps extends IPropsWithClassName {
	className?: string;
	items: IParkingSpot[];
	showBottomSeparator?: boolean;
}

const ROOT_CLASS_NAME = 'occupiedRegistry';

const OccupiedRegistry = ({
	items,
	showBottomSeparator = false,
	className,
}: IOccupiedRegistryProps) => {
	const dialogRef = useRef<OccupiedDialogAPI>(null);

	const wrapperClassName = clsx(ROOT_CLASS_NAME, className);
	const cardsClassName = clsx(`${ROOT_CLASS_NAME}__cards`);
	const separatorClassName = clsx(`${ROOT_CLASS_NAME}__separator`);
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'cotnrols-fontsize-20',
		'controls-margin_bottom-l'
	);

	const onCardClick = (item: IParkingSpot) => {
		dialogRef.current?.open(item);
	};

	return items.length ? (
		<div className={wrapperClassName}>
			<OccupiedDialog ref={dialogRef} />
			<div className={titleClassName}>Уже занятые мной</div>
			<div className={cardsClassName}>
				{items.map((item) => {
					return (
						<OccupiedCard
							key={item.id}
							item={item}
							onCardClick={onCardClick}
						/>
					);
				})}
				{showBottomSeparator && <div className={separatorClassName} />}
			</div>
		</div>
	) : (
		<></>
	);
};

export default OccupiedRegistry;
