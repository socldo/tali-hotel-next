
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { getCookie } from 'cookies-next';
import querystring from 'querystring';
import { ReportModel } from '../../../interface/ReportModel';

export default function NumberOfVisitorsAndRevenue() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [dataReport, setDataReport] = useState<ReportModel.NumberOfVisitorsAndRevenue[]>([]);

    const token = getCookie('jwt_token')?.toString();

    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {

        fetchReport();

    }, []);
    const fetchReport = async (): Promise<void> => {
        try {
            let currentDate = new Date();
            let currentYear: number = currentDate.getFullYear();


            const queryParams = querystring.stringify({ area_id: -1, hotel_id: -1, from_date: `01/01/${currentYear}`, to_date: `01/01/${currentYear + 1}`, group_by_type: 4 });

            const response = await fetch(`/api/reports/number-of-visitors-and-revenue?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();

            console.log(queryParams);

            console.log('data:', data);

            setDataReport(data.data);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    function convertDateFormat(inputDate: string): string {
        const parts = inputDate.split("-");

        if (parts.length !== 3) {
            throw new Error("Định dạng ngày không hợp lệ");
        }

        const year = parts[0];
        const month = parts[1];

        return `${month}/${year}`;
    }
    useEffect(() => {
        if (dataLoaded) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


            let orders = dataReport?.map(item => item.order_quantity);
            let revenue = dataReport?.map(item => item.total_revenue);
            let labels = dataReport?.map(item => convertDateFormat(item.report_time));

            const data = {
                labels: labels,
                datasets: [
                    // {
                    //     label: 'Lượt khách',
                    //     data: orders,
                    //     fill: false,
                    //     borderColor: documentStyle.getPropertyValue('--blue-500'),
                    //     tension: 0.4
                    // },
                    {
                        label: 'Doanh thu',
                        data: revenue,
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--pink-500'),
                        tension: 0.4
                    }
                ]
            };
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    },
                    title: {
                        display: true,
                        text: 'Biểu đồ doanh thu trong năm',
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }

            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [dataLoaded, dataReport]
    );

    return (

        <Chart type="line" data={chartData} options={chartOptions} />

    )
}
