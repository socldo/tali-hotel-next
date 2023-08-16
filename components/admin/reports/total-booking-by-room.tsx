
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { getCookie } from 'cookies-next';
import { ReportModel } from '../../../interface/ReportModel';
import querystring from 'querystring';
import randomColor from 'randomcolor';

interface Props {

    fromDate: string;
    toDate: string;
    areaId: number;
    hotelId: number;
    search: number;
}

const RpTotalBookingByRoom: React.FC<Props> = ({ fromDate, toDate, areaId, hotelId, search }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const token = getCookie('jwt_token')?.toString();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataReport, setDataReport] = useState<ReportModel.NumberOfVisitorsAndRevenue[]>([]);


    const columnColors = randomColor({
        count: dataReport?.length, // Số lượng màu cần tạo
        luminosity: 'bright', // Chọn màu sáng
        format: 'rgba' // Định dạng màu là rgba
    });
    useEffect(() => {

        fetchReport();
    }, []);


    useEffect(() => {

        fetchReport();
    }, [search]);

    useEffect(() => {

        if (dataLoaded) {
            const documentStyle = getComputedStyle(document.documentElement);

            // const textColor = documentStyle.getPropertyValue('--text-color');

            let labels = dataReport?.map(item => item.room_name);

            const dataValues = dataReport?.map(item => item.quantity);

            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Số lượng',
                        data: dataValues,
                        backgroundColor: columnColors,
                        borderColor: columnColors,
                        borderWidth: 1
                    }
                ]
            };
            const options = {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Biểu đồ số lượng đặt phòng',
                        position: 'bottom',
                        fontSize: 16
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        }

    }, [dataLoaded, dataReport]
    );


    const fetchReport = async (): Promise<void> => {
        try {

            const queryParams = querystring.stringify({ area_id: areaId, hotel_id: hotelId, from_date: fromDate, to_date: toDate, group_by_type: 4 });


            const response = await fetch(`/api/reports/total-booking-by-room?${queryParams}`, {
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
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };




    return (
        <>

            <div>
                <Chart type="bar" data={chartData} options={chartOptions} />
            </div>


        </>
    )
}

export default RpTotalBookingByRoom;