import { useEffect, useRef, useState } from 'react';
import Header from '../../../controls/_header/Header';
import ScreenLayout from '../../../controls/_layout/ScreenLayout';
import Title from '../../../controls/_title/Title';
import './AdminScreen.css';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	QuerySnapshot,
	where,
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useRecoilValue } from 'recoil';
import { UserAtom } from '../../core/state/UserAtom';
import { useLoading } from '../../core/utils/useLoading';
import Button from '../../../controls/_button/Button';
import InfoIcon from '../../../controls/_icons/InfoIcon';
import type { IAdminParkingSpot } from '../../components/_adminParkingSpots/_registry/AdminParkingSpotsRegistry';
import AdminParkingSpotsRegistry from '../../components/_adminParkingSpots/_registry/AdminParkingSpotsRegistry';
import PopupDialog, { type TPopupDialogAPI } from '../../../controls/_popup/PopupDialog';
import { AuthAtom } from '../../core/state/AuthAtom';
import clsx from 'clsx';
import CopyIcon from '../../../controls/_icons/CopyIcon';

const ROOT_CLASS_NAME = 'adminScreen';
const TITLE_WRAPPER_CLASS_NAME = `${ROOT_CLASS_NAME}__titleWrapper`;

const DEFAULT_INFO_DETAIL =
	'Создавайте парковочные места, закрепляйте постоянных владельцев за ними и рассылайте новым сотрудникам код приглашения на парковку';

const AdminScreen = () => {
	const [parkingSpots, setparkingSpots] = useState<IAdminParkingSpot[]>([]);
	const [copied, setCopied] = useState(false);
	const [parkingName, setParkingName] = useState('');
	const userAtom = useRecoilValue(UserAtom);
	const authAtom = useRecoilValue(AuthAtom);
	const { runProcess } = useLoading();

	const dialogRef = useRef<TPopupDialogAPI>(null);

	const popupContentWrapperClassName = clsx(`${ROOT_CLASS_NAME}__popupContentWrapper`);
	const visitingCodeClassName = clsx(
		`${ROOT_CLASS_NAME}__visitingCode`,
		'controls-fontweight-normal'
	);
	const copyIconClassName = clsx(`${ROOT_CLASS_NAME}__copyIcon`);
	const copyHintClassName = clsx(
		`${ROOT_CLASS_NAME}__copyHint`,
		copied && `${ROOT_CLASS_NAME}__copyHint_show`
	);
	const copyWrapperClassName = `${ROOT_CLASS_NAME}__copyWrapper`;

	useEffect(() => {
		runProcess(() => {
			const q = query(
				collection(db, 'parkingSpots'),
				where('parkingId', '==', userAtom.parkingId),
				orderBy('name')
			);
			return getDocs(q).then((querySnapshot: QuerySnapshot) => {
				const users: IAdminParkingSpot[] = querySnapshot.docs.map((doc) => ({
					key: doc.id,
					...(doc.data() as Omit<IAdminParkingSpot, 'key'>),
				}));
				setparkingSpots(() => users);
			});
		});
	}, []);

	useEffect(() => {}, []);

	const onInfoClick = () => {
		runProcess(() => {
			if (userAtom.parkingId && authAtom.role === 'admin') {
				return getDoc(doc(db, 'parkings', userAtom.parkingId)).then((snap) => {
					if (snap.exists()) {
						const { name } = snap.data();
						setParkingName(() => name);
						dialogRef.current?.show();
					}
				});
			}
		});
	};

	const onCopyClick = () => {
		navigator.clipboard.writeText(userAtom.parkingId || '');
		setCopied(() => true);
		setTimeout(() => setCopied(() => false), 1500);
	};

	return (
		<>
			<PopupDialog
				ref={dialogRef}
				showCloseButton
				showCommitButton={false}
				showRejectButton={false}
			>
				<div className={popupContentWrapperClassName}>
					<span
						className={clsx(
							'controls-fontsize-20',
							'controls-fontcolor-main',
							'controls-fontweight-medium'
						)}
					>{`Вы - администратор «${parkingName}»`}</span>
					<span className={clsx('controls-fontcolor-hint')}>{DEFAULT_INFO_DETAIL}</span>
					<div className={copyWrapperClassName}>
						<span className={copyHintClassName}>Код приглашения скопирован!</span>
						<button
							className={visitingCodeClassName}
							onClick={onCopyClick}
						>
							{userAtom.parkingId}
							<CopyIcon
								className={copyIconClassName}
								size={20}
							/>
						</button>
					</div>
				</div>
			</PopupDialog>
			<div>
				<Header
					showHome
					homePosition='center'
				/>

				<ScreenLayout>
					<div className={TITLE_WRAPPER_CLASS_NAME}>
						<Title text='Управление парковкой' />
						<Button
							icon={<InfoIcon size={26} />}
							onClick={onInfoClick}
						/>
					</div>
					<AdminParkingSpotsRegistry
						items={parkingSpots}
						setItems={setparkingSpots}
					/>

					{/* {loading ?? (
					<div className={LOADER_WRAPPER_CLASS_NAME}>
						<Loader />
					</div>
				)} */}
				</ScreenLayout>
			</div>
		</>
	);
};

export default AdminScreen;
