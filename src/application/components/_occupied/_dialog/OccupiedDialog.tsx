import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './OccupiedDialog.css';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
	type ForwardedRef,
	type ReactNode,
} from 'react';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import OwnerCard from '../../../../controls/_ownerCard/OwnerCard';
import PopupDialog, { type TPopupDialogAPI } from '../../../../controls/_popup/PopupDialog';
import type { IBooking } from '../../../core/state/BookingsAtom';
import { useLoading } from '../../../core/utils/useLoading';
import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import type { ISpotOwner } from '../../../../controls/types/ISpotOwner';
import type { IUser } from '../../../core/state/UserAtom';
import { getDatePeriodTitle } from '../../../../controls/utils/getDatePeriodTitle';

interface IOccupiedDialogProps extends IPropsWithClassName {}

const ROOT_CLASS_NAME = 'occupiedDialog';

interface IInfoBlockProps extends IPropsWithClassName {
	title: string;
	content: string | ReactNode;
}

export type OccupiedDialogAPI = {
	open: (spot: IBooking) => void;
};

const InfoBlock = ({ title, content, className }: IInfoBlockProps) => {
	const blockClassName = clsx(`${ROOT_CLASS_NAME}__infoBlock`, className);
	const contentWrapperClassName = clsx(`${ROOT_CLASS_NAME}__blockContentWrapper`);

	return (
		<div className={blockClassName}>
			<div className='controls-margin_bottom-4xs'>{title}</div>
			<div className={contentWrapperClassName}>{content}</div>
		</div>
	);
};

const OccupiedDialog = ({}: IOccupiedDialogProps, ref: ForwardedRef<OccupiedDialogAPI>) => {
	const [spotInfo, setSpotInfo] = useState<IBooking>();
	const [owner, setOwner] = useState<ISpotOwner>({
		email: null,
		telegram: null,
		fullName: null,
	});
	const popupRef = useRef<TPopupDialogAPI>(null);
	const userLoading = useLoading();

	useImperativeHandle(ref, () => ({
		open: (spot) => {
			setSpotInfo(() => spot);
			return popupRef.current?.show();
		},
	}));

	const templateClassName = clsx(`${ROOT_CLASS_NAME}__template`);
	const blocksClassName = clsx(`${ROOT_CLASS_NAME}__infoBlocks`);

	useEffect(() => {
		if (spotInfo?.renterId) {
			userLoading
				.runProcess(() => {
					return getDoc(doc(db, 'users', spotInfo.renterId));
				})
				.then((snap: DocumentSnapshot) => {
					if (snap.exists()) {
						const user = snap.data() as IUser;
						setOwner(() => {
							return {
								email: user.email,
								telegram: user.telegram,
								fullName: user.fullName,
							};
						});
					}
				});
		}

		return () => {
			setOwner(() => {
				return {
					email: null,
					telegram: null,
					fullName: null,
				};
			});
		};
	}, [spotInfo]);

	return (
		<PopupDialog
			ref={popupRef}
			showCloseButton
		>
			<div className={templateClassName}>
				<div className={blocksClassName}>
					<InfoBlock
						title='Место'
						content={spotInfo?.parkingSpotName}
					/>
					<InfoBlock
						title={`Занято вами на ${getDatePeriodTitle(
							spotInfo?.startDate || null,
							spotInfo?.endDate || null
						)}`}
						content={getDatesPeriod([
							spotInfo?.startDate ?? null,
							spotInfo?.endDate ?? null,
						])}
					/>
					<OwnerCard
						title='Информация о владельце'
						item={owner}
						loading={userLoading.loading}
					/>
				</div>
			</div>
		</PopupDialog>
	);
};

export default forwardRef(OccupiedDialog);
