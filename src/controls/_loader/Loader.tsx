import type { IPropsWithClassName } from '../types/IPropsWithClassName';
import Car from '/displaced_car.png';
import './Loader.css';

const ROOT_CLASS_NAME = 'controls-loader';
const IMAGE_CLASS_NAME = `${ROOT_CLASS_NAME}__image`;

interface ILoaderProps extends IPropsWithClassName {}

const Loader = ({}: ILoaderProps) => {
	return (
		<div className={ROOT_CLASS_NAME}>
			<img
				className={IMAGE_CLASS_NAME}
				src={Car}
			/>
		</div>
	);
};

export default Loader;
