import type { TIconComponent } from './types/TIconComponent';

const CommitIcon: TIconComponent = (props) => {
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
				d='M25 0C38.807 0 50 11.1929 50 25C50 38.807 38.807 50 25 50C11.1929 50 0 38.807 0 25C0 11.1929 11.1929 0 25 0ZM25 3.75C13.264 3.75 3.75 13.264 3.75 25C3.75 36.736 13.264 46.25 25 46.25C36.736 46.25 46.25 36.736 46.25 25C46.25 13.264 36.736 3.75 25 3.75ZM21.875 28.5982L33.0492 17.4242C33.7815 16.6919 34.9685 16.6919 35.7007 17.4242C36.3665 18.0898 36.427 19.1315 35.8822 19.8655L35.7007 20.0757L23.2007 32.5757C22.5352 33.2415 21.4935 33.302 20.7595 32.7572L20.5492 32.5757L14.2992 26.3257C13.5669 25.5935 13.5669 24.4065 14.2992 23.6742C14.9648 23.0085 16.0065 22.948 16.7405 23.4927L16.9508 23.6742L21.875 28.5982Z'
				fill='currentColor'
			/>
		</svg>
	);
};

export default CommitIcon;
