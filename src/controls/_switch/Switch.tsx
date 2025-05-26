import clsx from 'clsx';
import './Switch.css';
import { forwardRef, useState, type ForwardedRef } from 'react';

type TSwitchItem<T> = {
	title: string;
	value: T;
};

interface ISwitchProps<T = string> {
	items: {
		left: TSwitchItem<T>;
		right: TSwitchItem<T>;
	};
	value?: T;
	sizes?: {
		width?: string;
		height?: string;
	};
	className?: string;
	onValueChanged?: (value: T) => void;
}

const ROOT_CLASS_NAME = 'controls-switch';

const Switch = (
	{ items, className, sizes, value, onValueChanged }: ISwitchProps,
	ref: ForwardedRef<HTMLDivElement>
) => {
	const [position, setPosition] = useState(items.right.value === value ? 'right' : 'left');

	const wrapperClassName = clsx(
		ROOT_CLASS_NAME,
		'controls-fontsize-16',
		'controls-fontweight-medium',
		className
	);
	const leftPartClassName = clsx(`${ROOT_CLASS_NAME}__part`, `${ROOT_CLASS_NAME}__leftPart`);
	const rightPartClassName = clsx(`${ROOT_CLASS_NAME}__part`, `${ROOT_CLASS_NAME}__rightPart`);

	const backClassName = clsx(
		`${ROOT_CLASS_NAME}__back`,
		position === 'left'
			? `${ROOT_CLASS_NAME}__back_shiftedLeft`
			: `${ROOT_CLASS_NAME}__back_shiftedRight`
	);

	const clickHandler = (selectedPosition: 'left' | 'right') => {
		setPosition(() => selectedPosition);
		onValueChanged?.(items[selectedPosition].value);
	};

	return (
		<div
			ref={ref}
			className={wrapperClassName}
			style={{ width: sizes?.width, height: sizes?.height }}
		>
			<div className={backClassName}>
				<div className={`${ROOT_CLASS_NAME}__backContent`}>
					<span className={`${ROOT_CLASS_NAME}__leftPart_hidden`}>
						{items.left.title}
					</span>
					<span className={`${ROOT_CLASS_NAME}__rightPart_hidden`}>
						{items.right.title}
					</span>
				</div>
			</div>
			<button
				value='left'
				className={leftPartClassName}
				onClick={() => clickHandler('left')}
			>
				<span>{items.left.title}</span>
			</button>
			<button
				value='right'
				className={rightPartClassName}
				onClick={() => clickHandler('right')}
			>
				<span>{items.right.title}</span>
			</button>
		</div>
	);
};

/**
 * Конпонент переключателя между двумя выбранными значениями.
 */
export default forwardRef(Switch);
