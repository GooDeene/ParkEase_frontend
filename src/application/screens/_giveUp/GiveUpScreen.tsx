import clsx from 'clsx';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import './GiveUpScreen.css';
import Header from '../../../controls/_header/Header';
import { useMemo, useState } from 'react';
import { getDatePeriodTitle } from '../../../controls/utils/getDatePeriodTitle';
import Datepicker from '../../../controls/_datepicker/Datepicker';
import Button from '../../../controls/_button/Button';
import Title from '../../../controls/_title/Title';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MyLeasesAtom } from '../../core/state/MyLeases';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import { auth, db } from '../../../../firebase';
import { MySpotAtom } from '../../core/state/MySpotAtom';
import { useLoading } from '../../core/utils/useLoading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getDatesPeriod } from '../../../controls/utils/getDatesPeriod';

const spotName = '12A';

const ROOT_CLASS_NAME = 'giveUpScreen';

export type TPeriod = {
	start: Date;
	end: Date;
};

const GiveUpScreen = () => {
	const navigate = useNavigate();
	const mySpotAtom = useRecoilValue(MySpotAtom);
	const [myLeasesAtom, setMyLeasesAtom] = useRecoilState(MyLeasesAtom);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const saveLoading = useLoading();

	const submitButtonClassName = clsx(`${ROOT_CLASS_NAME}__submitButton`);

	const excludedPeriods: TPeriod[] = useMemo(() => {
		return myLeasesAtom
			.map((lease) => {
				if (lease.startDate && lease.endDate) {
					return {
						start: lease.startDate,
						end: lease.endDate,
					};
				} else if (lease.startDate) {
					return {
						start: lease.startDate,
						end: lease.startDate,
					};
				}

				return null;
			})
			.filter((item) => item !== null);
	}, [myLeasesAtom]);

	const onDatesSelected = (start: Date | null, end: Date | null) => {
		setStartDate(() => start);
		setEndDate(() => end);
	};

	const onSubmitClick = () => {
		if (mySpotAtom.id && auth.currentUser && startDate) {
			const itemToAdd = {
				parkingSpotId: mySpotAtom.id,
				parkingSpotName: mySpotAtom.name,
				ownerId: auth.currentUser?.uid,
				startDate: startDate,
				endDate: endDate ?? startDate,
			};

			saveLoading
				.runProcess(() => {
					return addDoc(collection(db, 'leases'), itemToAdd);
				})
				.then((snap: DocumentReference) => {
					if (snap.id) {
						setMyLeasesAtom((prev) => {
							return [
								...prev,
								{
									id: snap.id,
									parkingSpotId: itemToAdd.parkingSpotId,
									parkingSpotName: itemToAdd.parkingSpotName,
									ownerId: itemToAdd.ownerId,
									startDate,
									endDate: endDate ?? startDate,
								},
							];
						});

						toast(
							`Вы уступили место на ${getDatePeriodTitle(
								startDate,
								endDate
							)} ${getDatesPeriod([startDate, endDate])}`,
							{
								type: 'success',
								autoClose: 2800,
							}
						);
						navigate('/main/giveUp');
					} else {
						return Promise.reject();
					}
				})
				.catch(() => {
					toast('Не удалось утсупить место!', { type: 'error', autoClose: 1400 });
				});
		}
	};

	return (
		<div>
			<Header showHome />
			<ScreenLayout>
				<Title text={`Уступить место ${spotName}`} />
				<div className={clsx('controls-margin_top-l', 'controls-fontcolor-main')}>
					<span className={clsx('controls-margin_bottom-3xs')}>{`На ${getDatePeriodTitle(
						startDate,
						endDate
					)}`}</span>
					<Datepicker
						calendarClassName='controls-margin_top-l'
						startDate={startDate}
						endDate={endDate}
						excludeDateIntervals={excludedPeriods}
						onSelectionComplete={onDatesSelected}
						inline
					/>
				</div>
				<Button
					className={submitButtonClassName}
					title='Уступить'
					disabled={startDate === null}
					onClick={onSubmitClick}
					loading={saveLoading.loading}
				/>
			</ScreenLayout>
		</div>
	);
};

export default GiveUpScreen;
