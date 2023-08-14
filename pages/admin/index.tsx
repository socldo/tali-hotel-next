
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import querystring from 'querystring';
import { ReportModel } from '../../interface/ReportModel';

const AdminPage = () => {

    const token = getCookie('jwt_token')?.toString();

    const [dataReport, setDataReport] = useState<ReportModel.BookingRevenueCustomer>();

    useEffect(() => {
        fetchReport()


    }, []);


    const fetchReport = async (): Promise<void> => {
        try {


            let currentDate = new Date();
            let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            let firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

            let fromDate = formatDate(firstDayOfMonth);
            let toDate = formatDate(firstDayOfNextMonth);

            const queryParams = querystring.stringify({ area_id: -1, hotel_id: -1, from_date: fromDate, to_date: toDate, group_by_type: 4 });

            const response = await fetch(`/api/reports/booking-revenue-customer?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setDataReport(data.data);
            // setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const formatDate = (date: Date | null): string => {
        if (date instanceof Date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return '';
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
            <div className="grid" style={{ 'display': 'flex' }}>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Đặt phòng</span>
                                <div className="text-900 font-medium text-xl">{dataReport?.total_order} </div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">
                            {dataReport?.total_order !== undefined && dataReport?.total_order_last_month !== undefined ? (
                                <>
                                    {dataReport.total_order > dataReport.total_order_last_month ? '+ ' : '- '}
                                    {Math.abs(dataReport.total_order - dataReport.total_order_last_month)}
                                </>
                            ) : ''}
                        </span>
                        <span className="text-500"> so với tháng trước</span>
                    </div>
                </div>

                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Doanh thu</span>
                                <div className="text-900 font-medium text-xl">{priceBodyTemplate(dataReport?.total_amount!)}</div>
                            </div>
                            <div className="flex items-center justify-center bg-orange-100 rounded-full" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-map-marker text-orange-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">
                            {dataReport?.total_amount !== undefined && dataReport?.total_amount_last_month !== undefined ? (
                                <>
                                    {dataReport.total_amount > dataReport.total_amount_last_month ? '+ ' : '- '}
                                    {dataReport.total_amount_last_month !== 0
                                        ? (((dataReport.total_amount - dataReport.total_amount_last_month) / dataReport.total_amount_last_month) * 100).toFixed(2)
                                        : '∞'}%
                                </>
                            ) : ''}
                        </span>
                        <span className="text-500"> so với tháng trước</span>
                    </div>
                </div>


                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Customers</span>
                                <div className="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-inbox text-cyan-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">520 </span>
                        <span className="text-500">newly registered</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Comments</span>
                                <div className="text-900 font-medium text-xl">152 Unread</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-comment text-purple-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">85 </span>
                        <span className="text-500">responded</span>
                    </div>
                </div>

                {/* <div className="card flex justify-content-center">
                <NumberOfHotelByAreaReport></NumberOfHotelByAreaReport>
            </div>
            <div className="card">
                <NumberOfVisitorsAndRevenue />
            </div> */}

            </div>

        </>
    )

}
export default AdminPage;