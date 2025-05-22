import clsx from 'clsx';
import './EmptyHint.css';

const ROOT_CLASS_NAME = 'controls-emptyHint';

interface IEmptyHintProps {
	title: string;
	detail?: string;
	igmSrc: string;
}

const EmptyHint = ({ title, detail, igmSrc }: IEmptyHintProps) => {
	const titleClassName = clsx(
		`${ROOT_CLASS_NAME}__title`,
		'controls-margin_bottom-l',
		'controls-fontsize-20'
	);
	const detailClassName = clsx(`${ROOT_CLASS_NAME}__detail`, 'controls-fontsize-14');

	return (
		<div className={ROOT_CLASS_NAME}>
			<img
				className='controls-margin_bottom-3xl'
				src={igmSrc}
			/>
			<span className={titleClassName}>{title}</span>
			<span className={detailClassName}>{detail}</span>
		</div>
	);
};

export default EmptyHint;
