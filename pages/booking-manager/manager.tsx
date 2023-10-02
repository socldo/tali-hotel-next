import { getCookie } from "cookies-next";
import Link from "next/link";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { CSSProperties, SetStateAction, useEffect, useRef, useState } from "react";
import { IBooking, IRoom } from "../../models";
import BookingDetail from "../../components/booking/BookingDetail";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const numberFormat = (e: any) =>
    new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    }).format(e);


const BookingManagerPage = () => {

    const router = useRouter()

    const [userId, setUserId] = useState<undefined | string>(getCookie("id")?.toString())
    const [bookingData, setBookingData] = useState<IBooking[]>()
    const [showModel, setShowModel] = useState(false)
    const [bookingId, setBookingId] = useState(0)
    const [bookingIdd, setBookingIdd] = useState<IBooking>()
    const [roomDate, setRoomeDate] = useState<IRoom[]>()
    const [visible, setVisible] = useState(false);

    const handlePayBooking = async () => {

        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        const url = `/api/bookings/users/${userId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        setBookingData(data.data);
        console.log(bookingData);


        return data.data;
    }

    useEffect(() => {
        handlePayBooking();
    }, [])


    const formatCurrency = (value: any) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const imageBodyTemplate = (product: any) => {
        return <img src={`${product.image}`} alt={product.image} className="w-32 shadow-2 border-round" />;
    };

    const priceBodyTemplate = (product: any) => {
        return numberFormat(product.amount);
    };

    const ratingBodyTemplate = (product: any) => {
        return <Rating value={product.rating} readOnly cancel={false} color={"red"} />;
    };

    const paymentStatusBodyTemplate = (product: any) => {
        return <Tag value={getSeverity(product)} severity={getColorSeverity(product)} ></Tag>;
    };

    const statusBodyTemplate = (booking: any) => {
        let statusName = '';
        let statusNameVI = '';

        switch (booking.status) {
            case 0:
                statusName = 'pre-booked';
                statusNameVI = 'Đặt trước';
                break;
            case 1:
                statusName = 'staying';
                statusNameVI = 'Đang ở';
                break;
            case 2:
                statusName = 'completed';
                statusNameVI = 'Hoàn tất';
                break;
            case 3:
                statusName = 'cancel';
                statusNameVI = 'Đã hủy';
                break;
            default:
                break;
        };

        const inlineStyle: CSSProperties = {
            borderRadius: 'var(--border-radius)',
            padding: '0.25em 0.5rem',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.3px',
        };

        switch (booking.status) {
            case 0:
                inlineStyle.backgroundColor = '#c8e6c9';
                inlineStyle.color = '#256029';
                break;
            case 1:
                inlineStyle.backgroundColor = '#b3e5fc';
                inlineStyle.color = '#23547b';
                break;
            case 2:
                inlineStyle.backgroundColor = '#feedaf';
                inlineStyle.color = '#8a5340';
                break;
            case 3:
                inlineStyle.backgroundColor = '#ffcdd2';
                inlineStyle.color = '#c63737';
                break;
            default:
                break;
        };

        return (
            <span style={inlineStyle}>
                {statusNameVI}
            </span>
        );
    };




    const hadleClickDetailButton = (product: any) => {
        setShowModel(true);
        setBookingId(product.id);
    };

    const handleReloadPage = () => {
        router.push("/booking-manager/manager")
    };

    const handleCancelBooking = async (id: number) => {

        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        const url = `/api/bookings/${id}/cancel`;

        const response = await fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();

        return data;

    }
    // <div>
    //     <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
    //     <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
    // </div>


    const getSeverity = (product: any) => {
        switch (product.payment_status) {
            case 0 || 1:
                return 'Chưa thanh toán';

            case 2:
                if (product.status == 3) {
                    return 'Chờ hoàn tiền';
                } else
                    return 'Đã thanh toán';

            case 3:
                return 'Đã huỷ';

            default:
                return null;
        }
    };

    const getColorSeverity = (product: any) => {
        switch (product.payment_status) {
            case 0:
                return 'info';

            case 2:
                return 'success';

            case 3:
                return 'danger';
            default:
                return null;
        }
    };


    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Đơn đặt phòng</span>
            <Button onClick={() => handleReloadPage()} icon="pi pi-refresh" rounded raised />
        </div>
    );

    const footer = `Tổng cộng có ${bookingData ? bookingData.length : 0} đơn hàng.`;

    const getDetailBooking = (product: any) => {
        return <div className="hover:text-blue-700 mr-4" onClick={() => hadleClickDetailButton(product)}>
            <i className="cursor-pointer active:bg-violet-200 focus:outline-none focus:ring focus:ring-violet-300 pi pi-eye" style={{ color: 'slateblue' }}>
            </i></div>
    };

    const toast = useRef<Toast>(null);

    const accept = async (booking: any) => {
        const response = await handleCancelBooking(parseInt(booking.id))

        if (response.status == 200) {
            toast.current?.show({ severity: 'info', summary: 'Thông báo', detail: 'Đã huỷ thành công', life: 3000 });
        } else {
            toast.current?.show({ severity: 'warn', summary: 'Thông báo', detail: `${response.message}`, life: 3000 });
        }
    }

    const reject = () => {
    }


    const cancelBooking = (product: IBooking) => {

        const routerHotel = () => {
            router.push(`/hotel/${product.hotel_id}`)

        }



        return (
            <>
                <div className="flex">
                    <div>
                        {getDetailBooking(product)}
                    </div>
                    <div>
                        <Toast ref={toast} />
                        <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Bạn chắn chắn muốn huỷ đơn đặt phòng này?"
                            header="Huỷ đơn đặt phòng" icon="pi pi-exclamation-triangle" accept={() => accept(bookingIdd)} reject={reject} />
                        <div className="card flex justify-content-center">
                            <div className="hover:text-blue-700 mr-4" onClick={(e) => { setVisible(true), setBookingIdd(product) }}>
                                <i className="cursor-pointer active:bg-violet-200 focus:outline-none focus:ring focus:ring-violet-300 pi pi-times" style={{ color: 'slateblue' }}>
                                </i>

                            </div>

                        </div>

                    </div>
                    <div onClick={(e) => routerHotel()}>
                        <i className="pi pi-replay" style={{ color: 'slateblue' }}></i>
                    </div>
                </div>
            </>
        )
    };



    return (
        <>
            <Dialog header="Thông tin đặt phòng" visible={showModel} style={{ width: '80vw' }} onHide={() => setShowModel(false)}>
                <BookingDetail id={bookingId}></BookingDetail>
            </Dialog>
            {userId ?
                <>
                    <div className="container mx-auto px-2 lg:px-2 py-5">
                        <DataTable value={bookingData} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                            <Column field="hotel_name" header="Tên khách sạn"></Column>
                            <Column header="Hình ảnh" body={imageBodyTemplate}></Column>
                            <Column field="amount" header="Giá tiền" body={priceBodyTemplate}></Column>
                            <Column field="type" header="Loại phòng"></Column>
                            {/* <Column field="rating" header="Đánh giá" body={ratingBodyTemplate}></Column> */}
                            <Column header="Thanh toán" body={paymentStatusBodyTemplate}></Column>
                            <Column header="Trạng thái" body={statusBodyTemplate}></Column>
                            {/* <Column header="" body={getDetailBooking}></Column> */}
                            <Column header="" body={(e) => cancelBooking(e)}></Column>
                            {/* <Column header="" body={(e) => function_1(e)}></Column> */}
                        </DataTable>
                    </div>
                </> :
                <div className="bg-gray-100 h-full">
                    <div className="bg-white p-6  md:mx-auto mt-16 mb-16 text-center">
                        <i
                            className="text-orange-500 pi pi-exclamation-circle"
                            style={{ fontSize: "4rem" }}
                        ></i>
                        <div className="text-center">
                            <h3 className="mt-2 md:text-2xl text-base text-gray-900 font-semibold text-center">
                                Đăng nhập để sử dụng tính năng này
                            </h3>
                            <p className="mt-2"> Vui lòng đăng nhập để quản lí đặt phòng của bạn! </p>
                            <div className="py-10 text-center rounded-lg">
                                <Link
                                    href="/auth"
                                    className="rounded-lg px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    );
}
export default BookingManagerPage;