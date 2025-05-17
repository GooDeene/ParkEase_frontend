import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './controls/styles/Indents.css';
import './controls/styles/Fonts.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
