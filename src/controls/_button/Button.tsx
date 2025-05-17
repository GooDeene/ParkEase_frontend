import clsx from 'clsx';
import './Button.css';
import type { Icon } from '../Constants';

type TPaddingSize = '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl';

interface IButtonProps {
	className?: string;
	onClick?: () => void;
	title: string;
	disabled?: boolean;
	fullWidth?: boolean;
	padding?: { t: TPaddingSize; r: TPaddingSize; b: TPaddingSize; l: TPaddingSize };

	// Если задана эта опция кнопка отображается в режиме иконки (без текста и заливки фона)
	icon?: Icon;
	iconSizes?: { width: number; height: number };
}

const Button = ({
	className,
	onClick,
	disabled,
	title,
	fullWidth = false,
	padding,
	icon,
	iconSizes,
}: IButtonProps) => {
	const buttonClassName = clsx(
		'controls-button',
		'controls-button-titleMode',
		!className?.includes('controls-fontsize') && 'controls-fontsize-20',
		!className?.includes('controls-fontweight') && 'controls-fontweight-medium',
		fullWidth && 'controls-button-w-full',
		padding
			? clsx(
					`controls-padding_top-${padding.t}`,
					`controls-padding_right-${padding.r}`,
					`controls-padding_bottom-${padding.b}`,
					`controls-padding_left-${padding.l}`
			  )
			: 'controls-button-default-paddings',
		className
	);

	const iconModeClassName = clsx('controls-button', 'controls-button-iconMode', className);

	return (
		<button
			className={icon ? iconModeClassName : buttonClassName}
			disabled={disabled}
			onClick={() => {
				onClick?.();
			}}
		>
			{!icon && title}
			{icon && (
				<img
					width={iconSizes?.width}
					height={iconSizes?.height}
					src={icon}
				/>
			)}
		</button>
	);
};

export default Button;
