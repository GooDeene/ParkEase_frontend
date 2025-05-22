import clsx from 'clsx';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import './GivenUpRegistry.css';
import EmptyHint from '../../../../controls/_emptyHint/EmptyHint';

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
				{items.length ? (
					items.map((item) => {
						return (
							<button
								key={item.id}
								className={cardClassName}
								onClick={() => onCardClick(item)}
							>
								{item.spotName}
							</button>
						);
					})
				) : (
					<EmptyHint
						title='На выбранные даты не нашлось свободных мест'
						detail='Попробуйте изменить или сбросить диапазон дат'
						igmSrc='/src/assets/no_park_sign.png'
					/>
				)}
			</div>
		</div>
	);
};

export default GivenUpRegistry;
