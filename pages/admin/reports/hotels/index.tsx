import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import RpTotalBookingByRoom from "../../../../components/admin/reports/total-booking-by-room";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Model } from "../../../../interface";
import { getCookie } from "cookies-next";
import querystring from "querystring";
import CustomerReviewReport from "../../../../components/admin/reports/customer-review";

function HotelReport() {

    const [hotels, setHotels] = useState<Model.Hotel[]>([]);
    const [hotelFilters, setHotelFilters] = useState<Model.Hotel[]>([]);
    const [hotel, setHotel] = useState<Model.Hotel>();

    const [branches, setBranches] = useState<Model.Branch[]>([]);
    const [branch, setBranch] = useState<Model.Branch | null>();
    const [fromDate, setFromDate] = useState<string | Date | Date[] | null>(null);
    const [toDate, setToDate] = useState<string | Date | Date[] | null>(null);
    const token = getCookie("jwt_token")?.toString();

    const [fromDateString, setFromDateString] = useState<string>('');
    const [toDateString, setToDateString] = useState<string>('');
    const [areaId, setAreaId] = useState<number>(-1);
    const [hotelId, setHotelId] = useState<number>(-1);
    const [search, setSearch] = useState<number>(0);
    const [search2, setSearch2] = useState<number>(0);

    useEffect(() => {
        fetchBranches();
        fetchHotels();
        let currentDate = new Date();
        let currentYear: number = currentDate.getFullYear();

        setFromDateString(`01/01/${currentYear}`);
        setToDateString(`01/01/${currentYear + 1}`)
        setAreaId(-1);

        setFromDate(currentDate);
        setToDate(currentDate);

    }, []);


    useEffect(() => {

        setHotelId(-1);
        setHotelFilters(!areaId && areaId != -1 ? hotels : hotels?.filter(hotel => hotel.branch_id == areaId));
    }, [areaId]);


    useEffect(() => {

        setFromDateString(formatDate(fromDate instanceof Date ? fromDate : null))
        setToDateString(formatDate(toDate instanceof Date ? toDate : null))

    }, [fromDate, toDate]);


    const fetchHotels = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ status: -1 });
            const response = await fetch(`/api/hotels/get-list?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setHotels(data.data);
            setHotelFilters(data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const fetchBranches = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ status: -1 });
            const response = await fetch(`/api/branches?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token,
                }),
            });

            const data = await response.json();
            setBranches(data.data);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };

    const handleSearchClick = () => {

        if (fromDate instanceof Date && toDate instanceof Date && fromDate > toDate) {
            toast.warning('Ngày không hợp lệ')
        }
        else {
            setSearch(search + 1)
        }


    };
    const handleSearchClick2 = () => {

        if (fromDate instanceof Date && toDate instanceof Date && fromDate > toDate) {
            toast.warning('Ngày không hợp lệ')
        }
        else {
            setSearch2(search2 + 1)
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

    return (
        <>
            <div className="card justify-content-center">
                <div className="flex">
                    <div className="mr-4">
                        <Dropdown
                            value={areaId}
                            onChange={(e: DropdownChangeEvent) => { setAreaId(e.value) }}
                            options={[
                                { label: "Tất cả", value: -1 },
                                ...(branches?.map((branch) => ({ label: branch.name, value: branch.id })) || []),
                            ]}
                            optionLabel="label"
                            placeholder="Khu vực"
                            className="w-full md:w-14rem"
                        />
                    </div>

                    <div className="mr-4">
                        <Dropdown
                            value={hotelId}
                            onChange={(e: DropdownChangeEvent) => { setHotelId(e.value) }}
                            options={[
                                { label: "Tất cả", value: -1 },
                                ...(hotelFilters?.map((hotel) => ({ label: hotel.name, value: hotel.id })) || []),
                            ]}
                            optionLabel="label"
                            placeholder="Khách sạn"
                            className="w-full md:w-14rem"
                        />
                    </div>


                    <div className="mr-4">
                        <span>Từ ngày: </span>
                        <Calendar value={fromDate} onChange={(e: any) => setFromDate(e.value)} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="mr-4">
                        <span>Đến ngày: </span>
                        <Calendar value={toDate} onChange={(e: any) => setToDate(e.value)} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="mr-4">
                        <Button icon="pi pi-search" rounded severity="success" aria-label="Search" onClick={handleSearchClick} />
                    </div>
                </div>
                <RpTotalBookingByRoom fromDate={fromDateString} toDate={toDateString} areaId={areaId} hotelId={hotelId} search={search} />
            </div>
            <div className="card justify-content-center">
                <div className="flex">
                    <div className="mr-4">
                        <Dropdown
                            value={areaId}
                            onChange={(e: DropdownChangeEvent) => { setAreaId(e.value) }}
                            options={[
                                { label: "Tất cả", value: -1 },
                                ...(branches?.map((branch) => ({ label: branch.name, value: branch.id })) || []),
                            ]}
                            optionLabel="label"
                            placeholder="Khu vực"
                            className="w-full md:w-14rem"
                        />
                    </div>

                    <div className="mr-4">
                        <Dropdown
                            value={hotelId}
                            onChange={(e: DropdownChangeEvent) => { setHotelId(e.value) }}
                            options={[
                                { label: "Tất cả", value: -1 },
                                ...(hotelFilters?.map((hotel) => ({ label: hotel.name, value: hotel.id })) || []),
                            ]}
                            optionLabel="label"
                            placeholder="Khách sạn"
                            className="w-full md:w-14rem"
                        />
                    </div>


                    <div className="mr-4">
                        <span>Từ ngày: </span>
                        <Calendar value={fromDate} onChange={(e: any) => setFromDate(e.value)} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="mr-4">
                        <span>Đến ngày: </span>
                        <Calendar value={toDate} onChange={(e: any) => setToDate(e.value)} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="mr-4">
                        <Button icon="pi pi-search" rounded severity="success" aria-label="Search" onClick={handleSearchClick2} />
                    </div>
                </div>
                <CustomerReviewReport fromDate={fromDateString} toDate={toDateString} areaId={areaId} hotelId={hotelId} search={search2} />
            </div>
        </>
    );
}

export default HotelReport;