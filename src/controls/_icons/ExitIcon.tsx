import type { TIconComponent } from './types/TIconComponent';

const ExitIcon: TIconComponent = (props) => {
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
				d='M37.5245 16.0757L46 24.5512L37.5245 33.0267'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M46 24.5513H14.9202'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
			<path
				d='M32.3759 29.9564V41.776C32.3759 42.0912 32.3137 42.4033 32.1928 42.6944C32.0719 42.9854 31.8947 43.2498 31.6715 43.4723C31.4482 43.6948 31.1832 43.871 30.8917 43.9908C30.6001 44.1107 30.2878 44.1718 29.9726 44.1707H8.42891C8.11156 44.1752 7.79649 44.1166 7.50199 43.9983C7.20749 43.88 6.93945 43.7043 6.71344 43.4815C6.48744 43.2587 6.30798 42.9931 6.1855 42.7003C6.06302 42.4075 5.99997 42.0933 6 41.776V7.36929C6.00335 7.05408 6.06889 6.74263 6.19288 6.45281C6.31686 6.16299 6.49685 5.9005 6.72251 5.6804C6.94818 5.46029 7.21508 5.28691 7.5079 5.1702C7.80072 5.05348 8.11371 4.99573 8.42891 5.00025H29.9726C30.6048 4.99795 31.2122 5.24573 31.6624 5.68953C32.1127 6.13333 32.3691 6.73715 32.3759 7.36929V18.6842'
				stroke='currentColor'
				strokeWidth='1.5'
			/>
		</svg>
	);
};

export default ExitIcon;
