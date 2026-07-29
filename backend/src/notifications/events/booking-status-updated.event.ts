import { BookingStatus } from 'src/common/enums';
export class BookingStatusUpdatedEvent {
    user_id: string;
    booking_id: string;
    status: BookingStatus;
}