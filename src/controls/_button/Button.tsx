import clsx from 'clsx';
import './Button.css';

interface IButtonProps {
    className?: string;
    onClick?: () => void;
    title: string;
    disabled?: boolean;
    size?: 'm' | 'l';
}

const Button = ({
    className,
    size = 'l',
    onClick,
    disabled,
    title
}: IButtonProps) => {
    const buttonClassName = clsx(
        'controls-button',
        size && 'controls-button-l',
        className
    );

    return (
        <button
            className={ buttonClassName }
            onClick={ () => {
                onClick?.();
            } }
            disabled={ disabled }
        >
            <span>{ title }</span>
        </button>
    );
};

export default Button;
