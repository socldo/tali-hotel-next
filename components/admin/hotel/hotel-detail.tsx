import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria';
import { Rating } from "primereact/rating";
import { getCookie } from 'cookies-next';
import { Checkbox } from "primereact/checkbox";
import { Hotel, RatingRate } from '../../../interface';

interface HotelDetailProps {

    hotel: Hotel | null;
}

const UserDetail: React.FC<HotelDetailProps> = ({
    hotel
}) => {
    const token = getCookie('jwt_token')?.toString();

    const [images, setImages] = useState<string[]>([]);
    const galleria = useRef<any>(null);
    const [ratingRate, setRatingRate] = useState<RatingRate | null>();



    useEffect(() => {
        setImages((hotel?.images || []).map(image => image.replace(/"/g, "")));



        let isMounted = true; // Biến cờ

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/hotels/${hotel?.id}/get-rating-rate`, {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: !token ? "" : token
                    }),
                });

                const data = await response.json();

                if (isMounted) {
                    console.log('data:', data);
                    setRatingRate(data.data);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // Đánh dấu component đã unmount
        };
    }, []);




    const statusBodyTemplate = (rowData: Hotel) => {

        return <span className={`status-badge status-${rowData.status ? 'active' : 'unactive'}`}>{(rowData.status) ? 'Đang hoạt động' : 'Tạm ngưng'}</span>;

    };

    const imageBodyTemplate = (rowData: Hotel) => {


        const responsiveOptions: GalleriaResponsiveOptions[] = [
            {
                breakpoint: '1500px',
                numVisible: 5
            },
            {
                breakpoint: '1024px',
                numVisible: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1
            }
        ];

        const itemTemplate = (item: any) => {


            return <img src={item} alt='image' style={{ width: '100%', display: 'block' }} />;
        }

        const thumbnailTemplate = (item: any) => {
            return <img src={item} alt='image' style={{ display: 'block', width: '80px', height: '60px' }} />;
        }

        return (
            <>
                {/* <div className="card flex justify-content-center"> */}
                <Galleria ref={galleria} value={images} responsiveOptions={responsiveOptions} numVisible={9} style={{ maxWidth: '50%' }}
                    circular fullScreen showItemNavigators item={itemTemplate} thumbnail={thumbnailTemplate} />

                <Button label="Hình ảnh" icon="pi pi-external-link" onClick={() => galleria.current?.show()} />
                {/* </div> */}
            </>
        )

    }

    if (!hotel) {
        return null; // Xử lý trường hợp user là null
    }
    return (
        <>
            <div className="card p-fluid" >
                <div style={{ display: 'flex' }}>
                    <div style={{ float: 'left', width: '50%' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Tên: </label>
                            <span>{hotel?.name}</span>
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số điện thoại: </label>
                            <span>{hotel?.phone}</span>
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Trạng thái: </label>
                            {statusBodyTemplate(hotel)}
                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Loại: </label>
                            <span>{hotel?.type_name}</span>
                        </div>
                        <div className="field">
                            <span> <Checkbox checked={hotel.is_popular == true}></Checkbox> </span>
                            <label style={{ fontWeight: 'bold' }}>Phổ biến </label>
                        </div>
                    </div>

                    <div style={{ float: 'left', width: '50%' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Khu vực: </label>
                            <span>{hotel?.branch_name}</span>
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Email: </label>
                            <span>{hotel?.email}</span>
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Ngày tạo: </label>
                            <span>{hotel?.created_at}</span>
                        </div>
                        <div className="field">
                            <span> <Checkbox checked={hotel.is_have_parking == true}></Checkbox> </span>
                            <label style={{ fontWeight: 'bold' }}>Bãi đỗ xe </label>

                        </div>
                        <div className="field">
                            <span> <Checkbox checked={hotel.is_have_wifi == true}></Checkbox> </span>
                            <label style={{ fontWeight: 'bold' }}>Wifi: </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-fluid" >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ float: 'left', width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số bài viết đánh giá: </label>
                            <span>{ratingRate?.rate_count}</span>
                        </div>
                        <div className="flex justify-content-center">

                            <Rating value={5} readOnly cancel={false} /><div>:</div>
                        </div>
                        <div className="flex justify-content-center">
                            <Rating value={4} readOnly cancel={false} /><div>:</div>
                        </div>
                        <div className="flex justify-content-center">
                            <Rating value={3} readOnly cancel={false} /><div>:</div>
                        </div>
                        <div className="flex justify-content-center">
                            <Rating value={2} readOnly cancel={false} /><div>:</div>
                        </div>
                        <div className="flex justify-content-center">
                            <Rating value={1} readOnly cancel={false} /><div>:</div>
                        </div>
                    </div>
                    <div style={{ float: 'left', width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số sao trung bình: </label>
                            <span>{Number(ratingRate?.average_rate.toFixed(1))}</span>
                        </div>

                        <div className="field">
                            <span>{ratingRate?.total_five_star}</span>
                        </div>
                        <div className="field">
                            <span>{ratingRate?.total_four_star}</span>
                        </div>
                        <div className="flex justify-content-center">
                            <span>{ratingRate?.total_three_star}</span>
                        </div>
                        <div className="flex justify-content-center">
                            <span>{ratingRate?.total_two_star}</span>
                        </div>
                        <div className="field">
                            <span>{ratingRate?.total_one_star}</span>
                        </div>

                    </div>

                </div>

            </div>
            <div className="card p-fluid" >

                <div className="field">
                    <label style={{ fontWeight: 'bold' }}>Mô tả: </label>
                    <span>{hotel?.description}</span>
                </div>
                <div className="field">
                    <label style={{ fontWeight: 'bold' }}>Mô tả ngắn gọn: </label>
                    <span>{hotel?.short_description}</span>
                </div>

                <div className="field">
                    <label style={{ fontWeight: 'bold' }}>Tính năng đặt biệt: </label>
                    <span>{hotel?.highlight_property}</span>
                </div>
            </div>
            {imageBodyTemplate(hotel)}

        </>
    );
};



export default UserDetail;