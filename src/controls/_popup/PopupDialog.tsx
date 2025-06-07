import clsx from 'clsx';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import './PopupDialog.css';
import Button from '../_button/Button';
import {
	forwardRef,
	useImperativeHandle,
	useState,
	type ForwardedRef,
	type PropsWithChildren,
} from 'react';
import CrossCircleIcon from '../_icons/CrossCircleIcon';
import CommitIcon from '../_icons/CommitIcon';

const ROOT_CLASS_NAME = 'controls-confirmationDialog';
const LAYOUT_CLASS_NAME = `${ROOT_CLASS_NAME}__layout`;

export type TPopupDialogAPI = {
	show: () => Promise<boolean | null>;
};

interface IPopupDialogProps extends IPropsWithClassName, PropsWithChildren {
	title?: string;
	detail?: string;
	showCloseButton?: boolean;
	showCommitButton?: boolean;
	showRejectButton?: boolean;
}

const PopupDialog = (
	{
		children,
		title,
		detail,
		showCloseButton = false,
		showCommitButton = true,
		showRejectButton = true,
	}: IPopupDialogProps,
	ref: ForwardedRef<TPopupDialogAPI>
) => {
	const [isOpen, setIsOpen] = useState(false);
	// const [title, setTitle] = useState('');
	// const [detail, setDetail] = useState<string | null>(null);

	const [resolve, setResolve] = useState<Function | null>(null);

	useImperativeHandle(ref, () => {
		return {
			show: showPopup,
		};
	});

	const resetStates = () => {
		document.body.style.overflow = '';
		setIsOpen(() => false);
	};

	const showPopup = () => {
		setIsOpen(() => true);
		document.body.style.overflow = 'hidden';

		return new Promise<boolean | null>((res) => {
			setResolve(() => res);
		});
	};

	const onCommitClick = () => {
		resetStates();
		resolve?.(true);
	};

	const onRejectClick = () => {
		resetStates();
		resolve?.(false);
	};

	const onCloseClick = () => {
		resetStates();
		resolve?.(null);
	};

	const dialogClassName = clsx(`${ROOT_CLASS_NAME}__dialog`);
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-fontsize-20',
		'controls-fontcolor-main',
		'controls-fontweight-medium'
	);
	const detailClassName = clsx(`${ROOT_CLASS_NAME}__detail`, 'controls-fontcolor-hint');
	const buttonsClassName = clsx(`${ROOT_CLASS_NAME}__buttons`);
	const closeButtonClassName = clsx(`${ROOT_CLASS_NAME}__closeButton`);

	if (!isOpen) return null;

	const DefaultContent = (
		<>
			<span className={titleClassName}>{title}</span>
			{detail && <span className={detailClassName}>{detail}</span>}
			{showCommitButton ||
				(showRejectButton && (
					<div className={buttonsClassName}>
						{showRejectButton && (
							<Button
								icon={<CrossCircleIcon className='controls-fontcolor-error' />}
								onClick={onRejectClick}
							/>
						)}
						{showCommitButton && (
							<Button
								icon={<CommitIcon className='controls-fontcolor-accent' />}
								onClick={onCommitClick}
							/>
						)}
					</div>
				))}
		</>
	);

	return (
		<div className={ROOT_CLASS_NAME}>
			<div className={LAYOUT_CLASS_NAME} />
			<div className={dialogClassName}>
				{showCloseButton && (
					<Button
						className={closeButtonClassName}
						icon={<CrossCircleIcon size={26} />}
						onClick={onCloseClick}
					/>
				)}
				{children ?? DefaultContent}
			</div>
		</div>
	);
};

export default forwardRef(PopupDialog);
