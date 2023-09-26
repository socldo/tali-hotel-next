import { getCookie } from "cookies-next";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import { Model } from "../../interface";
import querystring from 'querystring';
import { ConfirmPopup } from "primereact/confirmpopup";
import { toast } from 'react-toastify'
import { useRouter } from "next/router";

function Favorite() {
    const token = getCookie('jwt_token')?.toString();
    const userId = getCookie('id')?.toString();
    const [renderCount, setRenderCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [confirmPopup, setConfirmPopup] = useState(false);

    const buttonEl = useRef(null);

    const [hotel, setHotel] = useState<Model.Hotel>();
    const [hotels, setHotels] = useState<Model.Hotel[]>([]);
    const router = useRouter()

    useEffect(() => {
        fetchHotels()

    }, []);
    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            await fetchHotels();
        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [renderCount]);

    const handleChangeStatus = async (hotel: any) => {

        try {

            const response = await fetch(`/api/hotels/favorite`, {
                method: "POST",
                body: JSON.stringify({
                    hotel_id: hotel.id
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log('data:', data);


            if (data.status == 200) {

                setRenderCount(renderCount + 1);
            }
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };


    const fetchHotels = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ user_id: userId });

            const response = await fetch(`/api/hotels/get-list-favorite?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();

            setHotels(data.data);
            setLoading(false);
            console.log(1);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Khách sạn yêu thích</span>
        </div>
    );
    const footer = `Tổng cộng có ${hotels ? hotels.length : 0} khách sạn.`;

    const imageBodyTemplate = (hotel: any) => {
        return <img src={`${hotel.images[0]}`} alt={hotel.images[0]} className="w-32 shadow-2 border-round" />;
    };

    const heartBodyTemplate = (rowData: any) => {

        const accept = async () => {

            let changeStatus = await handleChangeStatus(hotel);

            if (changeStatus?.status === 200) {
                toast.success('Cập nhật thành công');
            }
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')
        };


        const handleChangeFavorite = (rowData: any) => {
            setHotel(rowData)
            setConfirmPopup(true)
        }
        const handlePushHotel = (hotel: any) => {
            setHotel(rowData)

            router.push(`/hotel/${hotel?.id}`)
        };
        return (
            <>
                <div>
                    <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                        message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                        rejectLabel="Không" />

                    <div className="flex">
                        <div onClick={(e) => handleChangeFavorite(rowData)}>
                            <i className="pi pi-heart-fill" style={{ color: 'red', fontSize: '2rem' }} ></i>
                        </div>
                        <div style={{ marginLeft: '1rem' }} onClick={(e) => handlePushHotel(rowData)}>
                            <i className="pi pi-chevron-circle-right" style={{ color: 'blue', fontSize: '2rem' }} ></i>
                        </div>

                    </div>

                </div >
            </>
        )

    }

    return (<>


        {token ?
            <>
                <div className="container mx-auto px-2 lg:px-2 py-5">
                    <DataTable loading={loading} value={hotels} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                        <Column field="name" header="Tên khách sạn"></Column>
                        <Column field="type_name" header="Loại"></Column>
                        <Column header="Hình ảnh" body={imageBodyTemplate}></Column>
                        <Column field="address" header="Địa chỉ"></Column>

                        {/* <Column field="rating" header="Đánh giá" body={ratingBodyTemplate}></Column> */}
                        {/* <Column header="Trạng thái" body={statusBodyTemplate}></Column> */}
                        {/* <Column header="" body={getDetailBooking}></Column> */}
                        {/* <Column header="" body={(e) => cancelBooking(e)}></Column> */}
                        <Column header="" body={(e) => heartBodyTemplate(e)}></Column>
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
    </>);
}

export default Favorite;