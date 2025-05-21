import type { ISpotOwner } from './ISpotOwner';

export interface IParkingSpot {
	id: string;
	startDate: Date | null;
	endDate: Date | null;
	spotName: string;
	owner: ISpotOwner;
}
