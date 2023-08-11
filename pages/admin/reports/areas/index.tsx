import React, { useEffect, useState } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Button } from "primereact/button";
import CustomerReviewReport from "../../../../components/admin/reports/customer-review";
import { Model } from "../../../../interface";
import { getCookie } from "cookies-next";
import querystring from "querystring";
import { toast } from "react-toastify";

function AreaReport() {
    const [branches, setBranches] = useState<Model.Branch[]>([]);
    const [branch, setBranch] = useState<Model.Branch | null>();
    const [fromDate, setFromDate] = useState<string | Date | Date[] | null>(null);
    const [toDate, setToDate] = useState<string | Date | Date[] | null>(null);
    const token = getCookie("jwt_token")?.toString();

    const [fromDateString, setFromDateString] = useState<string>('');
    const [toDateString, setToDateString] = useState<string>('');
    const [areaId, setAreaId] = useState<number>(-1);
    const [search, setSearch] = useState<number>(0);

    useEffect(() => {
        fetchBranches();

        let currentDate = new Date();
        let currentYear: number = currentDate.getFullYear();

        setFromDateString(`01/01/${currentYear}`);
        setToDateString(`01/01/${currentYear + 1}`)
        setAreaId(-1);

        setFromDate(currentDate);
        setToDate(currentDate);

    }, []);


    useEffect(() => {

        setFromDateString(formatDate(fromDate instanceof Date ? fromDate : null))
        setToDateString(formatDate(toDate instanceof Date ? toDate : null))

    }, [fromDate, toDate]);


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
        <div className="card justify-content-center">
            <div className="flex">
                <div className="mr-4">
                    <Dropdown
                        value={branch}
                        onChange={(e: DropdownChangeEvent) => { setBranch(e.value), setAreaId(e.value) }}
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
            <CustomerReviewReport fromDate={fromDateString} toDate={toDateString} areaId={areaId} search={search} />
        </div>
    );
}

export default AreaReport;
