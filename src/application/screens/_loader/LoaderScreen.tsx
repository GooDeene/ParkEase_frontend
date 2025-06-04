import clsx from 'clsx';
import './LoaderScreen.css';
import Car from '/displaced_car.png';
import LogoLarge from '/src/assets/logo_big.svg';
import { useLayoutEffect } from 'react';

const ROOT_CLASS_NAME = 'loaderScreen';

const LoaderScreen = () => {
	const logoClassName = clsx(`${ROOT_CLASS_NAME}__logo`);
	const imgClassName = clsx(`${ROOT_CLASS_NAME}__image`);

	useLayoutEffect(() => {
		const body = document.querySelector('body');
		if (body) {
			body.style.backgroundImage = `url('/background.png')`;
		}

		return () => {
			if (body) {
				body.style.backgroundImage = ``;
			}
		};
	}, []);

	return (
		<div className={ROOT_CLASS_NAME}>
			<img
				className={logoClassName}
				src={LogoLarge}
			/>
			<img
				className={imgClassName}
				src={Car}
			/>
		</div>
	);
};

export default LoaderScreen;
