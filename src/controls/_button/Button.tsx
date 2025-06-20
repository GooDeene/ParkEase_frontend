import clsx from 'clsx';
import type { TPaddingSize } from '../_input/types/TPaddingSize';
import { forwardRef, type ForwardedRef, type ReactNode, type SyntheticEvent } from 'react';
import './Button.css';

import InnerLoader from '../../application/components/_innerLoader/InnerLoader';

type TButtonColor = 'main' | 'accent' | 'error' | 'white';

interface IButtonProps {
	className?: string;
	onClick?: (event: SyntheticEvent) => void;
	title?: string | ReactNode;
	disabled?: boolean;
	fullWidth?: boolean;
	padding?: { t: TPaddingSize; r: TPaddingSize; b: TPaddingSize; l: TPaddingSize };
	color?: TButtonColor;
	borderColor?: TButtonColor;
	backgroundColor?: TButtonColor;
	showBorder?: boolean;
	loaderHeight?: number;

	// Если задана эта опция кнопка отображается в режиме иконки (без текста и заливки фона)
	icon?: ReactNode;
	loading?: boolean;
}

const Button = (
	{
		className,
		onClick,
		disabled,
		title,
		fullWidth = false,
		padding,
		icon,
		loading = false,
		color = 'white',
		borderColor = 'main',
		backgroundColor = 'main',
		showBorder = false,
		loaderHeight,
	}: IButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
) => {
	const buttonClassName = clsx(
		'controls-button',
		'controls-button-titleMode',
		`controls-button_${color}`,
		`controls-button_${borderColor}Border`,
		`controls-button_${backgroundColor}Background`,
		showBorder && `controls-button_bordered`,
		!className?.includes('controls-fontsize') && 'controls-fontsize-20',
		!className?.includes('controls-fontweight') && 'controls-fontweight-medium',
		fullWidth && 'controls-button-w-full',
		!loading
			? padding
				? clsx(
						`controls-padding_top-${padding.t}`,
						`controls-padding_right-${padding.r}`,
						`controls-padding_bottom-${padding.b}`,
						`controls-padding_left-${padding.l}`
				  )
				: 'controls-button-default-paddings'
			: '',
		className
	);

	const iconModeClassName = clsx('controls-button', 'controls-button-iconMode', className);

	return (
		<button
			ref={ref}
			className={icon ? iconModeClassName : buttonClassName}
			disabled={disabled}
			onClick={(e: SyntheticEvent) => {
				onClick?.(e);
			}}
		>
			{loading ? (
				<InnerLoader height={loaderHeight ?? 56} />
			) : (
				<>
					{!icon && title}
					{icon && icon}
				</>
			)}
		</button>
	);
};

export default forwardRef(Button);
