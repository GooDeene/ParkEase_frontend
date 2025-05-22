import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Switch from '../../../controls/_switch/Switch';
import OccupiedSubScreen from './_subScreens/OccupiedSubScreen';
import './MainScreen.css';

const SWITCH_ITEMS = {
	left: {
		title: 'Занять',
		value: 'auth',
	},
	right: {
		title: 'Уступить',
		value: 'reg',
	},
};

const ROOT_CLASS_NAME = 'mainScreen';

const MainScreen = () => {
	const switchClassName = clsx(`${ROOT_CLASS_NAME}__modeSwitch`, 'controls-margin_bottom-l');
	return (
		<div>
			<Header />
			<ScreenLayout>
				<div className={switchClassName}>
					<span className='controls-margin_bottom-l'>Место на парковке</span>
					<Switch items={SWITCH_ITEMS} />
				</div>
				<OccupiedSubScreen />
			</ScreenLayout>
		</div>
	);
};

export default MainScreen;
