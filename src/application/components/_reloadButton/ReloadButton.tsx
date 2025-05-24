import { useRef } from 'react';
import type { IPropsWithClassName } from '../../../controls/types/IPropsWithClassName';
import './ReloadButton.css';
import ReloadIcon from '../../../controls/_icons/ReloadIcon';
import Button from '../../../controls/_button/Button';
import clsx from 'clsx';

interface IReloadButtonProps extends IPropsWithClassName {
	onClick?: () => void;
}

const ROOT_CLASS_NAME = 'reloadButton';

const ReloadButton = ({ className, onClick }: IReloadButtonProps) => {
	const ref = useRef<HTMLButtonElement>(null);

	return (
		<Button
			ref={ref}
			className={clsx(ROOT_CLASS_NAME, className)}
			icon={<ReloadIcon size={30} />}
			onClick={onClick}
		/>
	);
};

export default ReloadButton;
