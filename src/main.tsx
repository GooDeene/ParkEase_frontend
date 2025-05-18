import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './controls/styles/Indents.css';
import './controls/styles/Fonts.css';
import 'react-datepicker/dist/react-datepicker.css';

import App from './App.tsx';

import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';

registerLocale('ru', ru);
setDefaultLocale('ru');

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
