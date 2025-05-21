import clsx from 'clsx';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import './GivenUpRegistry.css';

interface IGivenUpRegistryProps {
	items: IParkingSpot[];
}

const GivenUpRegistry = ({ items }: IGivenUpRegistryProps) => {
	const rootClassName = clsx('givenUpRegistry');
	const cardClassName = clsx(`${rootClassName}__card`, 'controls-fontsize-40');

	const onCardClick = (item: IParkingSpot) => {
		console.log(`Клик по карточке ${item.spotName}`);
	};

	return (
		<div className='givenUpRegistry__wrapper'>
			<div className={rootClassName}>
				{items.map((item) => {
					return (
						<button
							key={item.id}
							className={cardClassName}
							onClick={() => onCardClick(item)}
						>
							{item.spotName}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default GivenUpRegistry;
