import clsx from 'clsx';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import './GivenUpRegistry.css';

interface IGivenUpRegistryProps {
	items: IParkingSpot[];
}

const ROOT_CLASS_NAME = 'givenUpRegistry';

const GivenUpRegistry = ({ items }: IGivenUpRegistryProps) => {
	const cardClassName = clsx(`${ROOT_CLASS_NAME}__card`, 'controls-fontsize-40');

	const onCardClick = (item: IParkingSpot) => {
		console.log(`Клик по карточке ${item.spotName}`);
	};

	return (
		<div className='givenUpRegistry__wrapper'>
			<div className={ROOT_CLASS_NAME}>
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
