import { useEffect, useState } from 'react';
import LoaderScreen from '../_loader/LoaderScreen';

interface IDeboundecLoaderScreenProps {
	loading: boolean;
}

const DebouncedLoaderScreen = ({ loading }: IDeboundecLoaderScreenProps) => {
	const [showingDebounce, setShowingDebounce] = useState(true);

	useEffect(() => {
		setTimeout(() => setShowingDebounce(() => false), 450);
	}, []);

	if (loading || showingDebounce) {
		return <LoaderScreen />;
	}

	return null;
};

export default DebouncedLoaderScreen;
