import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria';
import { Rating } from "primereact/rating";

interface HotelDetailProps {

    hotel: Model.Hotel | null;
}

const UserDetail: React.FC<HotelDetailProps> = ({
    hotel
}) => {

    const [images, setImages] = useState<string[]>([]);
    const galleria = useRef<any>(null);



    useEffect(() => {
        setImages((hotel?.images || []).map(image => image.replace(/"/g, "")));
    }, []);


    const statusBodyTemplate = (rowData: Model.Hotel) => {

        return <span className={`status-badge status-${rowData.status ? 'active' : 'unactive'}`}>{(rowData.status) ? 'Đang hoạt động' : 'Tạm ngưng'}</span>;

    };

    const imageBodyTemplate = (rowData: Model.Hotel) => {


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
            console.log(item);

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
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ marginRight: '1em', }}>
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
                    </div>

                    <div>
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

                    </div>
                </div>
            </div>
            <div className="card p-fluid" >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ marginRight: '1em' }}>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số bài viết đánh giá: </label>
                            <span>{100}</span>
                        </div>
                        <div className="card flex justify-content-center">
                            <Rating value={4.8} readOnly cancel={false} />
                        </div>
                    </div>
                    <div className="field">
                        <label style={{ fontWeight: 'bold' }}>Số sao trung bình: </label>
                        <span>{4.8}</span>
                    </div>

                </div>
            </div>

            {imageBodyTemplate(hotel)}

        </>
    );
};



export default UserDetail;