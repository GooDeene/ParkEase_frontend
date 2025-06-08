import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './OccupiedDialog.css';
import {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
	type ForwardedRef,
	type ReactNode,
} from 'react';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import OwnerCard from '../../../../controls/_ownerCard/OwnerCard';
import PopupDialog, { type TPopupDialogAPI } from '../../../../controls/_popup/PopupDialog';

interface IOccupiedDialogProps extends IPropsWithClassName {}

const ROOT_CLASS_NAME = 'occupiedDialog';

interface IInfoBlockProps extends IPropsWithClassName {
	title: string;
	content: string | ReactNode;
}

export type OccupiedDialogAPI = {
	open: (spot: IParkingSpot) => void;
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
	const [spotInfo, setSpotInfo] = useState<IParkingSpot>();
	const popupRef = useRef<TPopupDialogAPI>(null);

	useImperativeHandle(ref, () => ({
		open: (spot) => {
			setSpotInfo(() => spot);
			return popupRef.current?.show();
		},
	}));

	const templateClassName = clsx(`${ROOT_CLASS_NAME}__template`);
	const blocksClassName = clsx(`${ROOT_CLASS_NAME}__infoBlocks`);

	return (
		<PopupDialog
			ref={popupRef}
			showCloseButton
		>
			<div className={templateClassName}>
				<div className={blocksClassName}>
					<InfoBlock
						title='Место'
						content={spotInfo?.spotName}
					/>
					<InfoBlock
						title={`Занято вами на ${spotInfo?.endDate ? 'период' : 'дату'}`}
						content={getDatesPeriod([
							spotInfo?.startDate ?? null,
							spotInfo?.endDate ?? null,
						])}
					/>
					<OwnerCard
						title='Информация о владельце'
						item={spotInfo?.owner ?? { telegram: null, phone: null }}
					/>
				</div>
			</div>
		</PopupDialog>
	);
};

export default forwardRef(OccupiedDialog);
