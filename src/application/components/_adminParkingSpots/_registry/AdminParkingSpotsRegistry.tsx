import './AdminParkingSpotsRegistry.css';
import AdminParkingSpotCard from '../_card/AdminParkingSpotCard';
import AdminAddSpotButton from '../_addSpotButton/AdminAddSpotButton';

export interface IAdminParkingSpot {
	key: string;
	parkingId: string | null;
	name: string;
	attachedUserId: string | null;
}

interface IAdminParkingSpotsRegistryProps {
	items: IAdminParkingSpot[];
	setItems: React.Dispatch<React.SetStateAction<IAdminParkingSpot[]>>;
	loading?: boolean;
}

const ROOT_CLASS_NAME = 'adminParkingSpotsRegistry';
const WRAPPER_CLASS_NAME = `${ROOT_CLASS_NAME}__wrapper`;

const AdminParkingSpotsRegistry = ({ items, setItems }: IAdminParkingSpotsRegistryProps) => {
	return (
		<div className={WRAPPER_CLASS_NAME}>
			<div className={ROOT_CLASS_NAME}>
				<AdminAddSpotButton
					items={items}
					setItems={setItems}
				/>
				{!!items.length &&
					items.map((item) => {
						return (
							<AdminParkingSpotCard
								key={item.key}
								item={item}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default AdminParkingSpotsRegistry;
