import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './MyGivenSpotCard.css';
import Button from '../../../../controls/_button/Button';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { MyLeasesAtom, type ILease } from '../../../core/state/MyLeases';
import { useLoading } from '../../../core/utils/useLoading';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	QuerySnapshot,
	where,
} from 'firebase/firestore';
import { db } from '../../../../../firebase';
import InnerLoader from '../../_innerLoader/InnerLoader';
import { toast } from 'react-toastify';
import { getDatePeriodTitle } from '../../../../controls/utils/getDatePeriodTitle';
import { useSetRecoilState } from 'recoil';

interface IMyGivenSpotCardProps extends IPropsWithClassName {
	item: ILease;
}

const ROOT_CLASS_NAME = 'myGivenSpotCard';
const DEFAULT_OCCUPIED_MESSAGE = 'Место уже занято';

// const checkRejectAvailability = (): boolean => {};

const MyGivenSpotCard = ({ className, item }: IMyGivenSpotCardProps) => {
	const [hideAction, setHideAction] = useState(false);
	const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
	const [title, setTitle] = useState(getDatesPeriod([item.startDate, item.endDate]));
	const [spotFree, setSpotFree] = useState<boolean>(false);
	const { loading, runProcess } = useLoading();
	const setMyLeasesAtom = useSetRecoilState(MyLeasesAtom);

	const cardClassName = clsx(ROOT_CLASS_NAME, className);
	const actionWrapperClassName = clsx(
		`${ROOT_CLASS_NAME}__actionWrapper`,
		hideAction && `${ROOT_CLASS_NAME}__actionWrapper_hidden`
	);
	const emptyActionClassName = clsx(`${ROOT_CLASS_NAME}__emptyButtonHint`);
	const actionButtonClassName = clsx(`${ROOT_CLASS_NAME}__actionButton`, 'controls-fontsize-14');
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-fontsize-18',
		hideAction && 'controls-fontweight-medium'
	);

	useEffect(() => {
		runProcess(() => {
			const q = query(collection(db, 'bookings'), where('leaseId', '==', item.id));
			return getDocs(q);
		}).then((snap: QuerySnapshot) => {
			setSpotFree(() => snap.empty);
		});
	}, []);

	const onCardClick = () => {
		if (!showTimeout && item.endDate) {
			setHideAction(() => true);
			const timeout = setTimeout(() => {
				setHideAction(() => false);
				setShowTimeout(() => null);
			}, 1200);
			setShowTimeout(() => timeout);
		}
	};

	const onRejectClick = (event: SyntheticEvent) => {
		event.stopPropagation();

		runProcess(() => {
			const q = query(collection(db, 'bookings'), where('leaseId', '==', item.id));
			return getDocs(q).then((snap) => {
				const canDelete = snap.empty;
				setSpotFree(() => canDelete);

				if (canDelete) {
					return deleteDoc(doc(db, 'leases', item.id)).then(() => {
						toast(
							`Вы больше не уступаете свое место на ${getDatePeriodTitle(
								item.startDate,
								item.endDate
							)} ${getDatesPeriod([item.startDate, item.endDate])}`,
							{
								type: 'success',
								autoClose: 3500,
							}
						);

						setMyLeasesAtom((prev) => {
							const res = [...prev];

							const index = prev.findIndex((lease) => item.id === lease.id);

							if (index !== -1) {
								return [...prev.slice(0, index), ...prev.slice(index + 1)];
							}

							return res;
						});
					});
				}
			});
		});
	};

	useEffect(() => {
		setTitle(() => getDatesPeriod([item.startDate, item.endDate]));
	}, []);

	return (
		<div
			className={cardClassName}
			onClick={onCardClick}
		>
			<span className={titleClassName}>{title}</span>
			<div className={actionWrapperClassName}>
				{loading ? (
					<InnerLoader
						style='dark'
						height={34}
					/>
				) : spotFree ? (
					<Button
						className={actionButtonClassName}
						title='Отказаться'
						padding={{
							t: 's',
							r: 'xs',
							b: 's',
							l: 'xs',
						}}
						onClick={onRejectClick}
						fullWidth
					/>
				) : (
					<span className={emptyActionClassName}>{DEFAULT_OCCUPIED_MESSAGE}</span>
				)}
			</div>
		</div>
	);
};

export default MyGivenSpotCard;
