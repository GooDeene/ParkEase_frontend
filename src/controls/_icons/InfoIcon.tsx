import type { TIconComponent } from './types/TIconComponent';

const InfoIcon: TIconComponent = (props) => {
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
				d='M25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0ZM25 4C13.402 4 4 13.402 4 25C4 36.598 13.402 46 25 46C36.598 46 46 36.598 46 25C46 13.402 36.598 4 25 4Z'
				fill='currentColor'
			/>
			<path
				d='M22.8193 35V19.824H28.1393V35H22.8193ZM25.4793 18.144C24.5087 18.144 23.7247 17.8733 23.1273 17.332C22.53 16.7907 22.2313 16.1187 22.2313 15.316C22.2313 14.5133 22.53 13.8413 23.1273 13.3C23.7247 12.7587 24.5087 12.488 25.4793 12.488C26.45 12.488 27.234 12.7493 27.8313 13.272C28.4287 13.776 28.7273 14.4293 28.7273 15.232C28.7273 16.072 28.4287 16.772 27.8313 17.332C27.2527 17.8733 26.4687 18.144 25.4793 18.144Z'
				fill='currentColor'
			/>
		</svg>
	);
};

export default InfoIcon;
