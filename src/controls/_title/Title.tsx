import clsx from 'clsx';
import './Title.css';

const ROOT_CLASS_NAME = 'controls-title';

interface ITitleProps {
	text: string;
}

const Title = ({ text }: ITitleProps) => {
	const wrapperClassName = clsx(
		ROOT_CLASS_NAME,
		'controls-text-center',
		'controls-fontsize-20',
		'controls-fontweight-medium',
		'controls-fontcolor-main'
	);

	return <div className={wrapperClassName}>{text}</div>;
};

export default Title;
