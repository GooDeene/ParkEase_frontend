import './ScreenLayout.css';

import { type PropsWithChildren } from 'react';

const ROOT_CLASS_NAME = 'controls-screenLayout';

const ScreenLayout = (props: PropsWithChildren) => {
	return <div className={ROOT_CLASS_NAME}>{props.children}</div>;
};

export default ScreenLayout;
