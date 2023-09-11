
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
    search: number;
    hotelId: number;
}



const CustomerReviewReport: React.FC<Props> = ({ fromDate, toDate, areaId, search, hotelId }) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const token = getCookie('jwt_token')?.toString();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataReport, setDataReport] = useState<ReportModel.CustomerReview[]>([]);


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

            const textColor = documentStyle.getPropertyValue('--text-color');

            let labels = dataReport?.map(item => item.name);

            const dataValues = dataReport?.map(item => item.quantity);

            const data = {
                labels: labels,
                datasets: [
                    {
                        data: dataValues,
                        backgroundColor: columnColors,
                        hoverBackgroundColor: columnColors
                    }
                ]
            };
            const options = {

                cutout: '60%',
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    },
                    title: {
                        display: true,
                        text: 'Biểu đồ đánh giá khách hàng',
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

            const response = await fetch(`/api/reports/customer-review?${queryParams}`, {
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

            <div style={{ 'width': '800px', 'height': '800px' }}>
                <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-80rem" />
            </div>


        </>
    )
}

export default CustomerReviewReport;