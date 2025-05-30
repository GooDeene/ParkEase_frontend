import type { TIconComponent } from './types/TIconComponent';

const ReloadIcon: TIconComponent = (props) => {
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
				d='M26.1183 8.67553L26.4873 8.05004L29.1128 5.42463C22.7274 4.09012 15.8147 5.90103 10.8584 10.8592C3.92567 17.7919 3.14567 28.5464 8.52015 36.3391L5.71657 39.1427L14.7165 40.4281L13.4311 31.4282L11.1456 33.7136C7.16016 27.3918 7.92199 18.9373 13.4293 13.43C16.9093 9.9501 21.5656 8.36461 26.1183 8.67553Z'
				fill='currentColor'
			/>
			<path
				d='M42.9983 9.57375L33.9983 8.28833L35.2838 17.2883L37.7838 14.7883C42.9292 21.2138 42.5237 30.6174 36.5692 36.5736C32.5747 40.5682 27.0275 42.0664 21.8711 41.0664L18.8875 44.0499C25.7929 46.259 33.6619 44.6245 39.1419 39.1445C46.5182 31.7682 46.9292 20.061 40.371 12.2028L42.9983 9.57375Z'
				fill='currentColor'
			/>
		</svg>
	);
};

export default ReloadIcon;
