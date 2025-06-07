import clsx from 'clsx';
import './Title.css';
import type { IPropsWithClassName } from '../types/IPropsWithClassName';

const ROOT_CLASS_NAME = 'controls-title';

interface ITitleProps extends IPropsWithClassName {
	text: string;
}

const Title = ({ text, className }: ITitleProps) => {
	const wrapperClassName = clsx(
		ROOT_CLASS_NAME,
		'controls-text-center',
		'controls-fontsize-20',
		'controls-fontweight-medium',
		'controls-fontcolor-main',
		className
	);

	return <div className={wrapperClassName}>{text}</div>;
};

export default Title;
