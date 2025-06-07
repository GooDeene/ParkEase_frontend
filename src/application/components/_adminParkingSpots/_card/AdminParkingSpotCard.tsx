import clsx from 'clsx';
import UserCircleIcon from '../../../../controls/_icons/UserCircleIcon';
import type { IAdminParkingSpot } from '../_registry/AdminParkingSpotsRegistry';
import './AdminParkingSpotCard.css';
import { useNavigate } from 'react-router';

interface IAdminParkingSpotCardProps {
	item: IAdminParkingSpot;
}

const ROOT_CLASS_NAME = 'adminParkingSpotCard';
const USER_ICON_CLASS_NAME = `${ROOT_CLASS_NAME}__userIcon`;

const AdminParkingSpotCard = ({ item }: IAdminParkingSpotCardProps) => {
	const navigate = useNavigate();
	const titleClassName = clsx('controls-fontsize-24', 'controls-fontweight-medium');

	const onClick = () => {
		navigate(`/parking-spot-editing/${item.key}`);
	};

	return (
		<div
			className={ROOT_CLASS_NAME}
			onClick={onClick}
		>
			<span className={titleClassName}>{item.name}</span>
			{item.attachedUserId && (
				<UserCircleIcon
					size={20}
					className={USER_ICON_CLASS_NAME}
				/>
			)}
		</div>
	);
};

export default AdminParkingSpotCard;
