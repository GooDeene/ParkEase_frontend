import LoaderGif from '/menu_spinner.gif';
import LoaderGifDark from '/menu_spinner_dark.gif';
import './InnerLoader.css';

interface IInnerLoaderProps {
	style?: 'light' | 'dark';
	height?: number;
}

const ROOT_CLASS_NAME = 'innerLoader';

const InnerLoader = ({ style, height }: IInnerLoaderProps) => {
	return (
		<div
			className={ROOT_CLASS_NAME}
			style={{ height }}
		>
			<img
				className={`${ROOT_CLASS_NAME}__gif`}
				src={style === 'dark' ? LoaderGifDark : LoaderGif}
			/>
		</div>
	);
};

export default InnerLoader;
