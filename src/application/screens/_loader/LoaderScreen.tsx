import clsx from 'clsx';
import './LoaderScreen.css';
import LogoLarge from '/src/assets/logo_big.svg';
import { useLayoutEffect } from 'react';
import Loader from '../../../controls/_loader/Loader';

const ROOT_CLASS_NAME = 'loaderScreen';

const LoaderScreen = () => {
	const logoClassName = clsx(`${ROOT_CLASS_NAME}__logo`);

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
			<Loader />
		</div>
	);
};

export default LoaderScreen;
