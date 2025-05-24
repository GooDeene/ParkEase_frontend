import type { TIconComponent } from './types/TIconComponent';

const NextArrowIcon: TIconComponent = (props) => {
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
			<g clipPath='url(#clip0_192_17)'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M15.0186 7.36666C13.7371 8.66666 13.7371 10.7667 15.0186 12.0667L27.7671 25L15.0186 37.9333C13.7371 39.2333 13.7371 41.3333 15.0186 42.6333C16.3 43.9333 18.37 43.9333 19.6514 42.6333L34.7329 27.3333C36.0143 26.0333 36.0143 23.9333 34.7329 22.6333L19.6514 7.33332C18.4029 6.06666 16.3 6.06666 15.0186 7.36666Z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default NextArrowIcon;
