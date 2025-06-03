import clsx from 'clsx';
import type { TPaddingSize } from '../_input/types/TPaddingSize';
import { forwardRef, type ForwardedRef, type ReactNode, type SyntheticEvent } from 'react';
import './Button.css';

import LoaderGif from '/menu_spinner.gif';

interface IButtonProps {
	className?: string;
	onClick?: (event: SyntheticEvent) => void;
	title?: string | ReactNode;
	disabled?: boolean;
	fullWidth?: boolean;
	padding?: { t: TPaddingSize; r: TPaddingSize; b: TPaddingSize; l: TPaddingSize };

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
	}: IButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
) => {
	const buttonClassName = clsx(
		'controls-button',
		'controls-button-titleMode',
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
				<img
					height={56}
					src={LoaderGif}
				/>
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
