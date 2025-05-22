import clsx from 'clsx';
import type { IPropsWithClassName } from '../../../../controls/types/IPropsWithClassName';
import './OccupiedDialog.css';
import Button from '../../../../controls/_button/Button';
import CrossIcon from '../../../../controls/_icons/CrossIcon';
import {
	forwardRef,
	useImperativeHandle,
	useState,
	type ForwardedRef,
	type ReactNode,
} from 'react';
import type { IParkingSpot } from '../../../../controls/types/TParkingSpot';
import { getDatesPeriod } from '../../../../controls/utils/getDatesPeriod';
import OwnerCard from '../../../../controls/_ownerCard/OwnerCard';

interface IOccupiedDialogProps extends IPropsWithClassName {}

const ROOT_CLASS_NAME = 'occupiedDialog';

interface IInfoBlockProps extends IPropsWithClassName {
	title: string;
	content: string | ReactNode;
}

export type OccupiedDialogAPI = {
	open: (spot: IParkingSpot) => void;
};

const InfoBlock = ({ title, content }: IInfoBlockProps) => {
	const blockClassName = clsx(`${ROOT_CLASS_NAME}__infoBlock`);
	const contentWrapperClassName = clsx(`${ROOT_CLASS_NAME}__blockContentWrapper`);

	return (
		<div className={blockClassName}>
			<div className='controls-margin_bottom-4xs'>{title}</div>
			<div className={contentWrapperClassName}>{content}</div>
		</div>
	);
};

const OccupiedDialog = ({}: IOccupiedDialogProps, ref: ForwardedRef<OccupiedDialogAPI>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [spotInfo, setSpotInfo] = useState<IParkingSpot>();

	useImperativeHandle(ref, () => ({
		open: (spot: IParkingSpot) => {
			setSpotInfo(() => spot);
			setIsOpen(() => true);
			document.body.style.overflow = 'hidden';
		},
	}));

	const layoutClassName = clsx(`${ROOT_CLASS_NAME}__layout`);
	const templateClassName = clsx(`${ROOT_CLASS_NAME}__template`);
	const closeClassName = clsx(`${ROOT_CLASS_NAME}__closeButton`);
	const blocksClassName = clsx(`${ROOT_CLASS_NAME}__infoBlocks`);

	const onCloseClick = () => {
		setSpotInfo(() => undefined);
		setIsOpen(() => false);
		document.body.style.overflow = '';
	};

	const onLayoutClick = () => {};

	return isOpen ? (
		<div>
			<div
				className={layoutClassName}
				onClick={onLayoutClick}
			/>
			<div className={templateClassName}>
				<Button
					className={closeClassName}
					icon={<CrossIcon size={30} />}
					onClick={onCloseClick}
				/>
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
		</div>
	) : (
		<></>
	);
};

export default forwardRef(OccupiedDialog);
