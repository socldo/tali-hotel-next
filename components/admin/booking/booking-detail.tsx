import { useEffect, useState } from "react";
import { Model } from "../../../interface";
import { getCookie } from "cookies-next";
import { Button } from "primereact/button";

interface Props {

    booking: Model.Booking | null;
}

const BookingDetailAdmin: React.FC<Props> = ({
    booking
}) => {

    const token = getCookie('jwt_token')?.toString();
    const [branchName, setBranchName] = useState<string>('');


    useEffect(() => {



        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/branches/${booking?.branch_id}`, {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: !token ? "" : token
                    }),
                });

                const data = await response.json();

                if (isMounted) {
                    setBranchName(data.data.name);
                }
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);


    const formatDate = (inputDate: string) => {

        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const bodyStatus = (status: number) => {
        const statusMap: Record<number, string> = {
            1: 'Đặt trước',
            2: 'Đang ở',
            3: 'Hoàn tất',
        };

        const statusName = statusMap[status] || 'Đã hủy';

        return <>{statusName}</>;
    };

    const priceBodyTemplate = (value: number) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        return (
            <span>
                {formatter.format(value)}
            </span>

        );
    };

    return (
        <>
            <div className="card p-fluid" >
                <div style={{ display: 'flex' }}>
                    <div style={{ float: 'left', width: '50%' }}>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Khu vực: </label>
                            <span>{branchName}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Ngày nhận phòng: </label>
                            <span>{`${formatDate(booking?.checkin_date!)} 13:00`}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Tên khách hàng: </label>
                            <span>{booking?.first_name} {booking?.last_name}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Email: </label>
                            <span>{booking?.email} </span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Ngày tạo: </label>
                            <span>{booking?.created_at}</span>
                        </div>
                    </div>
                    <div style={{ float: 'left', width: '50%' }}>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Khách sạn: </label>
                            <span>{booking?.hotel_name}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Ngày trả phòng: </label>
                            <span>{`${formatDate(booking?.checkout_date!)} 12:00`}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số điện thoại: </label>
                            <span>{booking?.phone}</span>
                        </div>




                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Trạng thái: </label>
                            <span>{bodyStatus(booking?.status!)}</span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="card p-fluid" >
                <div style={{ display: 'flex' }}>
                    <div style={{ float: 'left', width: '50%' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Tổng tiền: </label>
                            <span>{priceBodyTemplate(booking?.total_amount!)}</span>
                        </div>
                    </div>

                    <div style={{ float: 'left', width: '50%' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Đặt cọc: </label>
                            <span>{priceBodyTemplate(booking?.deposit_amount!)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default BookingDetailAdmin