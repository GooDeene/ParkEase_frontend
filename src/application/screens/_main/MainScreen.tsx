import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Switch from '../../../controls/_switch/Switch';
import OccupiedSubScreen from './_subScreens/OccupiedSubScreen';
import { useState } from 'react';
import './MainScreen.css';
import GivenUpSubScreen from './_subScreens/GivenUpSubScreen';

type TSwitchType = 'occupied' | 'give up';

const SWITCH_ITEMS = {
	left: {
		title: 'Занять',
		value: 'occupied',
	},
	right: {
		title: 'Уступить',
		value: 'give up',
	},
};

const ROOT_CLASS_NAME = 'mainScreen';

const MainScreen = () => {
	const [switchValue, setSwitchValue] = useState<TSwitchType>('occupied');
	const switchClassName = clsx(`${ROOT_CLASS_NAME}__modeSwitch`, 'controls-margin_bottom-l');

	const onSwitchChanged = (val: string) => {
		setSwitchValue(() => val as TSwitchType);
	};

	return (
		<div>
			<Header />
			<ScreenLayout>
				<div className={switchClassName}>
					<span className='controls-margin_bottom-l'>Место на парковке</span>
					<Switch
						value={switchValue}
						items={SWITCH_ITEMS}
						onValueChanged={onSwitchChanged}
					/>
				</div>
				{switchValue === 'occupied' ? <OccupiedSubScreen /> : <GivenUpSubScreen />}
			</ScreenLayout>
		</div>
	);
};

export default MainScreen;
