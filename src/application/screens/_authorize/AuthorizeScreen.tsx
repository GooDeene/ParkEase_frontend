import { useState } from 'react';
import Switch from '../../../controls/_switch/Switch';
import clsx from 'clsx';
import LoginSubScreen from './_subScreens/LoginScreen';
import RegistrationSubScreen from './_subScreens/RegistrationScreen';
import logo from '/src/assets/logo_high_res.png';
import './AuthorizeScreen.css';

const ROOT_CLASS_NAME = 'authorizeScreen';
const LOGO_CLASS_NAME = clsx(`${ROOT_CLASS_NAME}__logo`);
const SUB_SCREENS_CLASS_NAME = clsx(`${ROOT_CLASS_NAME}__subScreen`);
const HIDDEN_SUB_SCREEN_CLASS_NAME = clsx(`${SUB_SCREENS_CLASS_NAME}_hidden`);

const SWITCH_ITEMS = {
	left: {
		title: 'Авторизация',
		value: 'auth',
	},
	right: {
		title: 'Регистрация',
		value: 'reg',
	},
};

const AuthorizeScreen = () => {
	const [switchValue, setSwitchValue] = useState(SWITCH_ITEMS.left.value);

	return (
		<div className={ROOT_CLASS_NAME}>
			<img
				className={LOGO_CLASS_NAME}
				src={logo}
				width={100}
				height={100}
			/>
			<Switch
				items={SWITCH_ITEMS}
				value={switchValue}
				onValueChanged={setSwitchValue}
			/>
			<div className={SUB_SCREENS_CLASS_NAME}>
				<LoginSubScreen
					className={switchValue === 'auth' ? '' : HIDDEN_SUB_SCREEN_CLASS_NAME}
				/>
				<RegistrationSubScreen
					className={switchValue === 'reg' ? '' : HIDDEN_SUB_SCREEN_CLASS_NAME}
				/>
			</div>
		</div>
	);
};

export default AuthorizeScreen;
