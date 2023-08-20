import { getCookie } from "cookies-next";
import Link from "next/link";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { IBooking, IRoom } from "../../models";
import BookingDetail from "../../components/booking/BookingDetail";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout";

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
    const [roomDate, setRoomeDate] = useState<IRoom[]>()

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

    const statusBodyTemplate = (product: any) => {
        return <Tag value={getSeverity(product)} ></Tag>;
    };

    const hadleClickDetailButton = (product: any) => {
        setShowModel(true);
        setBookingId(product.id);
    };

    const handleReloadPage = () => {
        router.push("/booking-manager/manager")
    };


    const getSeverity = (product: any) => {
        switch (product.status) {
            case 0:
                return 'Chưa thanh toán';

            case 1:
                return 'Đã thanh toán';

            case 2:
                return 'Hoàn tất';

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

    const popUpDetail = () => {
        <ul className="">
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
            </div>
        </ul>
    }
    return (
        <>
            <Layout
                metadata={{
                    title: `Đặt phòng`,
                    description: ""
                }}
            >

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
                                <Column field="rating" header="Đánh giá" body={ratingBodyTemplate}></Column>
                                <Column header="Trạng thái" body={statusBodyTemplate}></Column>
                                <Column header="" body={getDetailBooking}></Column>
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

            </Layout>
        </>
    );
}
export default BookingManagerPage;