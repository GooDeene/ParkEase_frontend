import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Switch from '../../../controls/_switch/Switch';
import OccupiedSubScreen from './_subScreens/OccupiedSubScreen';
import { useState } from 'react';
import './MainScreen.css';
import GivenUpSubScreen from './_subScreens/GivenUpSubScreen';
import { useNavigate, useParams } from 'react-router';
import Title from '../../../controls/_title/Title';

enum SwithcValue {
	Occupate = 'occupate',
	GiveUp = 'giveUp',
}

const SWITCH_ITEMS = {
	left: {
		title: 'Занять',
		value: SwithcValue.Occupate,
	},
	right: {
		title: 'Уступить',
		value: SwithcValue.GiveUp,
	},
};

const ROOT_CLASS_NAME = 'mainScreen';

const MainScreen = () => {
	const params = useParams();
	const mode = params.mode;
	const navigate = useNavigate();

	const [switchValue, setSwitchValue] = useState<SwithcValue>(
		mode === SwithcValue.GiveUp ? mode : SwithcValue.Occupate
	);
	const switchClassName = clsx(`${ROOT_CLASS_NAME}__modeSwitch`, 'controls-margin_bottom-l');

	const onSwitchChanged = (val: string) => {
		setSwitchValue(() => val as SwithcValue);
		navigate(`/main/${val}`);
	};

	return (
		<div>
			<Header />
			<ScreenLayout>
				<div className={switchClassName}>
					<Title
						className='controls-margin_bottom-l'
						text='Место на парковке'
					/>
					<Switch
						value={switchValue}
						items={SWITCH_ITEMS}
						onValueChanged={onSwitchChanged}
					/>
				</div>
				{switchValue === SwithcValue.Occupate ? (
					<OccupiedSubScreen />
				) : (
					<GivenUpSubScreen />
				)}
			</ScreenLayout>
		</div>
	);
};

export default MainScreen;
