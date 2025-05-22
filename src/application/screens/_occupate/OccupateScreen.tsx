import clsx from 'clsx';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import './OccupateScreen.css';
import OwnerCard from '../../../controls/_ownerCard/OwnerCard';

const ROOT_CLASS_NAME = 'occupateScreen';

const spotName = '212';

const OccupateScreen = () => {
	const infoBlocksClassName = clsx(`${ROOT_CLASS_NAME}__infoBlocks`);
	const spotNameClassName = clsx(`${ROOT_CLASS_NAME}__spotNameWrapper`);
	const spotBlockClassName = clsx(`${ROOT_CLASS_NAME}__spotBlock`, 'controls-fontsize-40');

	return (
		<div>
			<Header />
			<ScreenLayout>
				<div className={infoBlocksClassName}>
					<div className={spotNameClassName}>
						<div className='controls-margin_bottom-3xs'>Занять</div>
						<div className={spotBlockClassName}>{spotName}</div>
					</div>
					<OwnerCard
						item={{
							phone: null,
							telegram: null,
						}}
					/>
				</div>
			</ScreenLayout>
		</div>
	);
};

export default OccupateScreen;
