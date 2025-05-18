import clsx from 'clsx';
import './Switch.css';
import { useState } from 'react';

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

const Switch = ({ items, className, sizes, onValueChanged }: ISwitchProps) => {
	const [position, setPosition] = useState('left');

	const rootClassName = clsx(
		'controls-switch',
		'controls-fontsize-16',
		'controls-fontweight-medium',
		className
	);
	const leftPartClassName = clsx('controls-switch__part', 'controls-switch__leftPart');
	const rightPartClassName = clsx('controls-switch__part', 'controls-switch__rightPart');

	const backClassName = clsx(
		'controls-switch__back',
		position === 'left'
			? 'controls-switch__back_shiftedLeft'
			: 'controls-switch__back_shiftedRight'
	);

	const clickHandler = (selectedPosition: 'left' | 'right') => {
		setPosition(() => selectedPosition);
		onValueChanged?.(items[selectedPosition].value);
	};

	return (
		<div
			className={rootClassName}
			style={{ width: sizes?.width, height: sizes?.height }}
		>
			<div className={backClassName}>
				<div className='controls-switch__backContent'>
					<span className='controls-switch__leftPart_hidden'>{items.left.title}</span>
					<span className='controls-switch__rightPart_hidden'>{items.right.title}</span>
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
export default Switch;
