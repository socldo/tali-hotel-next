import { getCookie } from "cookies-next";
import querystring from 'querystring';
import { Model } from "../../../interface";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabPanel, TabView } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SpeedDial } from "primereact/speeddial";
import { MenuItem } from "primereact/menuitem";
import { Dropdown } from "primereact/dropdown";
import { toast } from 'react-toastify'
import { ConfirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import BookingDetailAdmin from "../../../components/admin/booking/booking-detail";

function Booking() {
    const token = getCookie('jwt_token')?.toString();

    const [bookings, setBookings] = useState<Model.Booking[]>([]);
    const [booking, setBooking] = useState<Model.Booking>();

    const [bookingFilters, setBookingFilters] = useState<Model.Booking[]>([]);

    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusChange, setStatusChange] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [renderCount, setRenderCount] = useState(0);
    const [sortKeyBranch, setSortKeyBranch] = useState(null);
    const [sortKeyHotel, setSortKeyHotel] = useState(null);
    const [branches, setBranches] = useState<Model.Branch[]>([]);
    const [hotelFilters, setHotelFilters] = useState<Model.Hotel[]>([]);
    const [hotels, setHotels] = useState<Model.Hotel[]>([]);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [visibleDetail, setVisibleDetail] = useState<boolean>(false);

    const buttonEl = useRef(null);

    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(async () => {
            await fetchBookings();
            await fetchHotels();
            await fetchBranches();
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [renderCount]);

    useEffect(() => {
        filter()
    }, [sortKeyHotel, activeIndex, bookings]);

    useEffect(() => {

        setSortKeyHotel(null);
        setHotelFilters(!sortKeyBranch ? hotels : hotels?.filter(hotel => hotel.branch_id == sortKeyBranch));
        filter()
    }, [sortKeyBranch]);


    useEffect(() => {
        setHotelFilters(hotels);
    }, [hotels]);

    useEffect(() => {
        if (responseAPI?.status != 200) {
            setVisibleError(true);
        } else
            setVisibleError(false);

    }, [responseAPI]);



    const filter = () => {


        if (!sortKeyBranch) {

            if (!sortKeyHotel) {
                setBookingFilters(bookings?.filter((booking: { status: number }) => booking.status == activeIndex));
            } else {
                setBookingFilters(bookings?.filter(booking => booking.hotel_id == sortKeyHotel && booking.status == activeIndex));
            }
        }
        else {
            if (!sortKeyHotel) {
                setBookingFilters(bookings?.filter(booking => booking.branch_id == sortKeyBranch && booking.status == activeIndex));
            }
            else {
                setBookingFilters(bookings?.filter(booking => booking.hotel_id == sortKeyHotel && booking.status == activeIndex));
            }
        }

    };


    const fetchBookings = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ user_id: -1, hotel_id: -1, status: -1 });
            const response = await fetch(`/api/bookings?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setBookings(data.data);
            setLoading(false);

            setBookingFilters(data.data.filter((booking: { status: number }) => booking.status === 0));
            console.log(bookingFilters);

        } catch (error) {
            console.error('Error fetching:', error);
            setLoading(false);
        }
    };


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

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
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
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setBranches(data.data);

        } catch (error) {
            console.error('Error fetching:', error);
            setLoading(false);
        }
    };

    const handleChangeStatus = async (statusChange: number) => {

        try {

            const response = await fetch(`/api/bookings/${booking?.id}/change-status`, {
                method: "POST",
                body: JSON.stringify({
                    status: statusChange
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log('data:', data);

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

            if (data.status == 200) {

                setRenderCount(renderCount + 1);
            }
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };



    const header = (

        <div className="flex flex-column md:flex-row md:justify-between md:items-center" >
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Đặt trước" rightIcon="pi pi-hourglass ml-2" >
                </TabPanel>
                <TabPanel header="Đang ở" rightIcon="pi pi-moon ml-2">
                </TabPanel>
                <TabPanel header="Hoàn tất" rightIcon="pi pi-check-circle ml-2">
                </TabPanel>
                <TabPanel header="Bị hủy" rightIcon="pi pi-ban ml-2">
                </TabPanel>
            </TabView>


            <h4 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>
                Đặt phòng
            </h4>

            <div className="text-right">

                <Dropdown value={sortKeyBranch} options={[
                    { label: 'Tất cả', value: 0 },
                    ...(branches?.map(branch => ({ label: branch.name, value: branch.id })) || [])
                ]} optionLabel="label" placeholder="Khu vực"
                    onChange={(e) => setSortKeyBranch(e.value)}
                    style={{ marginRight: '.5em' }} />
                <Dropdown value={sortKeyHotel} options={[
                    { label: 'Tất cả', value: 0 },
                    ...(hotelFilters?.map(hotel => ({ label: hotel.name, value: hotel.id })) || [])
                ]} optionLabel="label" placeholder="Khách sạn"
                    onChange={(e) => setSortKeyHotel(e.value)}
                    style={{ marginRight: '.5em' }} />

                <span className="block mt-2 md:mt-0 p-input-icon-left" style={{ marginRight: '.5em' }}>
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                        placeholder="Search..."
                    />
                </span>
                <Button
                    label="Thêm Mới"
                    icon="pi pi-plus"
                    style={{ marginRight: '.5em' }}
                    onClick={() => {
                        // setVisible(true);
                        // setBranch(null);
                    }}
                />
            </div>
        </div>

    );
    const paymentStatusBody = (rowData: Model.Booking) => {

        return (
            <>
                {rowData.payment_status == 1
                    ? <Button icon="pi pi-check" rounded severity="success" aria-label="success" />
                    : <Button icon="pi pi-times" rounded severity="danger" aria-label="danger" />
                }


            </>
        )

    }
    const actionBodyTemplate = (rowData: Model.Booking) => {
        const handleClickUpdateStatus = (status: any) => {
            setConfirmPopup(true);
            setStatusChange(status);
        };

        const handleClickDetail = () => {
            setVisibleDetail(true);
        };
        const accept = async (status: any) => {

            let changeStatus = await handleChangeStatus(status);

            if (changeStatus?.status === 200) {
                toast.success('Cập nhật thành công');
            }
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')


        };

        const items: MenuItem[] = [

            {
                label: 'Detail',
                icon: 'pi pi-eye',
                command: () => {
                    handleClickDetail()
                }
            }
        ]
        if (rowData.status === 0) {
            items.push(
                {
                    label: 'Update-Active',
                    icon: 'pi pi-check',
                    command: () => {
                        handleClickUpdateStatus(1);
                    }
                },
                {
                    label: 'Update-Inactive',
                    icon: 'pi pi-times',
                    command: () => {
                        handleClickUpdateStatus(3);
                    }
                }
            );
        }
        if (rowData.status === 1) {
            items.push(
                {
                    label: 'Update-Active',
                    icon: 'pi pi-check',
                    command: () => {
                        handleClickUpdateStatus(2);
                    }
                }
            );
        }

        return (
            <>

                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={() => accept(statusChange)} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />

                <div className="flex align-items-center justify-content-center" style={{ marginRight: '3rem', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <SpeedDial onClick={() => { setBooking(rowData); }} model={items} direction="left" style={{ right: '3rem' }} />
                    </div>
                </div>
            </>
        )

    }

    return (
        <>
            <DataTable
                value={bookingFilters}
                scrollable scrollHeight="400px"
                loading={loading}
                className="mt-3"
                globalFilter={globalFilter}
                header={header}
                paginator rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                tableStyle={{ minWidth: '30rem' }}
            >
                <Column
                    header="STT"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    style={{ flexGrow: 1, flexBasis: '100px' }}
                ></Column>
                <Column field="last_name" header="Khách hàng" style={{ flexGrow: 1, flexBasis: '160px' }} sortable className="font-bold"></Column>
                <Column field="hotel_name" header="Khách sạn" style={{ flexGrow: 1, flexBasis: '160px' }} ></Column>
                <Column field="phone" header="Số điện thoại" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column field="checkin_date" header="Ngày nhận phòng" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column field="checkout_date" header="Ngày trả phòng" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column field="payment_status" header="Thanh toán" body={(booking) => paymentStatusBody(booking)} style={{ flexGrow: 1, flexBasis: '200px' }}></Column>

                <Column body={(booking) => actionBodyTemplate(booking)}></Column>

            </DataTable>

            <Dialog header="Chi tiết" visible={visibleDetail} onHide={() => setVisibleDetail(false)}
                style={{ width: '60vw' }} maximizable breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <p className="m-0">
                    <BookingDetailAdmin booking={booking ?? null} />

                </p>
            </Dialog>

        </>

    );
}

export default Booking;