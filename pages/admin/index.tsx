import { useEffect, useState } from "react";
import { Chart } from 'primereact/chart';
import { getCookie } from "cookies-next";
import { ReportModel } from "../../interface/ReportModel";
import randomColor from 'randomcolor';

const AdminPage = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [numberOfHotelByArea, setNumberOfHotelByArea] = useState<ReportModel.NumberOfHotelByArea[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false); // Biến cờ

    const columnColors = randomColor({
        count: numberOfHotelByArea.length, // Số lượng màu cần tạo
        luminosity: 'bright', // Chọn màu sáng
        format: 'rgba' // Định dạng màu là rgba
    });

    const token = getCookie('jwt_token')?.toString();
    useEffect(() => {

        fetchReportNumberOfHotelByArea();

    }, []);


    const fetchReportNumberOfHotelByArea = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/reports/number-of-hotel-by-area`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setNumberOfHotelByArea(data.data);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    useEffect(() => {
        if (dataLoaded) {
            const labels = numberOfHotelByArea.map(item => item.name);
            const dataValues = numberOfHotelByArea.map(item => item.hotel_quantity);

            const documentStyle = getComputedStyle(document.documentElement);
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
                        text: 'Số lượng khách sạn theo khu vực', // Tên biểu đồ
                        position: 'top'
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [dataLoaded, numberOfHotelByArea]);


    return (
        <>

            <div className="card flex justify-content-center">
                <Chart type="bar" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
            </div>
        </>

    )

}
export default AdminPage;