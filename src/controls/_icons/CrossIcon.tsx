import type { TIconComponent } from './types/TIconComponent';

const CrossIcon: TIconComponent = (props) => {
	return (
		<svg
			className={props.className}
			style={{ width: props.size, height: props.size, color: props.color }}
			width='50'
			height='50'
			viewBox='0 0 50 50'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M45 45L5 5M45 5L5 45'
				stroke='currentColor'
				strokeWidth='4'
				strokeLinecap='round'
			/>
		</svg>
	);
};

export default CrossIcon;
