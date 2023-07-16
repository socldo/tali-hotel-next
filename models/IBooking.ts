
export interface IRoomBookingData {
    id: number,
    amount: number,
    quantity: number
}
export interface IBooking {
    user_id: number,
    hotel_id: number;
    status: number,
    check_in: string,
    check_out: string,
    amount: number,
    total_amount: number,
    deposit_amount: number,
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    room_date: IRoomBookingData[]
}