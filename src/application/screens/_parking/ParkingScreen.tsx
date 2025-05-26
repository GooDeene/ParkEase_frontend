import Header from '../../../controls/_header/Header';
import GhostSign from '/src/assets/ghost_park_sign.png';
import './ParkingScreen.css';
import clsx from 'clsx';
import { useLayoutEffect } from 'react';
import { Link } from 'react-router';

const DEFAULT_EMPTY_TITLE = 'Ой! Кажется вы заблудились, ведь здесь ничего нет';
const DEFAULT_EMPTY_DETAIL = 'Вернуться на обитаемые парковки';

const ROOT_CLASS_NAME = 'parkingScreen';

const ParkingScreen = () => {
	useLayoutEffect(() => {
		const body = document.querySelector('body');
		if (body) {
			body.style.backgroundImage = `url('public/background.png')`;
		}

		return () => {
			if (body) {
				body.style.backgroundImage = ``;
			}
		};
	}, []);

	return (
		<div>
			<Header showHome />
			<div className={ROOT_CLASS_NAME}>
				<img
					width={250}
					height={250}
					src={GhostSign}
				/>
				<div
					className={clsx(
						'controls-fontsize-20',
						'controls-fontweight-medium',
						'controls-margin_top-4xl'
					)}
				>
					{DEFAULT_EMPTY_TITLE}
				</div>
				<Link to={'/main/occupate'}>{DEFAULT_EMPTY_DETAIL}</Link>
			</div>
		</div>
	);
};

export default ParkingScreen;
