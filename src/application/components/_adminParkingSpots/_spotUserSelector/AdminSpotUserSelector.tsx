import clsx from 'clsx';
import './AdminSpotUserSelector.css';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import AdminSpotUserCard from '../_spotUserCard/AdminSpotUserCard';
import { useEffect, useState } from 'react';
import type { TUser } from '../../../screens/_admin/SpotEditingScreen';

interface IAdminSpotUserSelectorProps extends IPropsWithClassName {
	users: TUser[];
	initialSelectedValue: TUser | null;
	disabledUsersIds?: string[];
}

const ROOT_CLASS_NAME = 'adminSpotUserSelector';

const AdminSpotUserSelector = ({
	users,
	className,
	initialSelectedValue,
	disabledUsersIds,
}: IAdminSpotUserSelectorProps) => {
	const [isDropdownOpen, setIsDropdwonOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<TUser | null>(initialSelectedValue);

	const mainClassName = clsx(ROOT_CLASS_NAME, className);
	const dropdownClassName = clsx(`${ROOT_CLASS_NAME}__dropdown`);
	const emptyOwnerClassName = clsx(`${ROOT_CLASS_NAME}__emptyOwner`);

	const onCardClick = (user: TUser) => {
		setIsDropdwonOpen(() => false);
		setSelectedUser(() => user);
	};

	const onDeattach = (_user: TUser) => {
		setSelectedUser(() => null);
	};

	useEffect(() => {
		setSelectedUser(() => initialSelectedValue);
	}, [initialSelectedValue]);

	return (
		<div className={mainClassName}>
			{selectedUser ? (
				<AdminSpotUserCard
					user={selectedUser}
					showDeattachButton
					onDeattach={onDeattach}
				/>
			) : (
				<>
					<div
						className={emptyOwnerClassName}
						onClick={() => setIsDropdwonOpen(() => true)}
					>
						Владелец не выбран
					</div>
					{isDropdownOpen && (
						<div className={dropdownClassName}>
							{users.map((user) => {
								return (
									<AdminSpotUserCard
										key={user.id}
										compact
										user={user}
										rounded={false}
										onClick={onCardClick}
										disabled={disabledUsersIds?.includes(user.id)}
									/>
								);
							})}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AdminSpotUserSelector;
