import Link from 'next/link'
import React, { useState } from 'react'
import { IHotel, IRoom } from '../../models'
import Button from './Button'
import StarRating from './StarRating'
import { Image } from 'primereact/image';
import { MdLocationOn } from '../../utils/icons'
import { Tag } from 'primereact/tag';
import { atom, useRecoilState } from 'recoil';
import { MapContainer } from '../map'
import GGMap from '../googlemap/GGMap'
import { Dialog } from 'primereact/dialog'
import { LoadScript } from '@react-google-maps/api'
interface Props {
    data?: IRoom[];
    city?: string;
}

const numberFormat = (e: any) =>
    new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    }).format(e);



const SearchResults: React.FC<Props> = ({ data, city }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            {city && (
                <h2 className="text-2xl font-bold mb-4 capitalize">
                    {city}: {data?.length} Kết quả
                </h2>
            )}
            {data?.map((hotel) => (
                <>
                    <div className="rounded-lg shadow-xl card flex flex-col lg:flex-row gap-1 border p-5 mb-5">
                        <div className="rounded-lg w-full h-full lg:w-1/4 object-cover">
                            <Image
                                width="500"
                                height="500"
                                src={hotel.images[0]}
                                preview
                            />
                        </div>

                        <div className="flex-1 flex flex-col justify-between lg:flex-row gap-1">
                            <div className="flex-auto w-64 lg:mx-4">
                                <div className="flex flex-wrap gap-1">
                                    <p className="text-xl font-bold text-secondary">
                                        {hotel.name}
                                    </p>                                   
                                </div>
                                <StarRating data={hotel.average_rate} />
                                <div className="text-sm underline text-secondary flex items-center flex-wrap gap-2">
                                    <MdLocationOn />
                                    <span className="cursor-pointer capitalize">
                                        {hotel.address}
                                    </span>
                                    <span className="cursor-pointer flex-wrap" >

                                        <p onClick={() => setVisible(true)}>Xem vị trí</p>
                                        
                                        <Dialog header={hotel.address} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>

                                            <GGMap lat={hotel.lat} lng={hotel.lng}></GGMap>
                                        </Dialog>
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <p className="text-justify text-sm mt-2 flex items-center flex-wrap gap-1">{hotel.description}</p>                                
                                </div>

                            </div>
                            <div
                                className="basic-1/4 font-semibold flex flex-row lg:flex-col justify-between items-center lg:items-end ">
                                {hotel.is_popular == 1 ? <div className="basic-1/4 font-semibold flex flex-row lg:flex-col justify-between items-center lg:items-end ">
                                    <Tag className='-mt-5 -mr-5' value={"Lựa chọn tốt nhất"} severity={'warning'}></Tag> 
                                    <p className='text-sm text-neutral-900 ml-2 justify-between items-right -mr-5'>{hotel.total_reviews} đánh giá</p></div> : 
                                    <div className="basic-1/4 font-semibold flex flex-row lg:flex-col justify-between items-center lg:items-end ">
                                        <Tag className='-mt-5 -mr-5' value={"Có thể đặt ngay"} severity={'success'}></Tag>
                                        <p className='text-sm text-neutral-900 ml-2 justify-between items-right -mr-5'>{hotel.total_reviews} đánh giá </p></div>  }
                                
                                <div > 
                                    <p className='text-neutral-500 ml-2 justify-between items-left'>{numberFormat(hotel.price)}</p>
                                    <Link
                                        href={'/hotel/' + hotel.id}
                                    >
                                        <Button
                                            text="Xem phòng &nbsp; >"
                                            textColor="text-white"
                                            bgColor="bg-lightPrimary"
                                        />
                                        
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            ))}
        </div>
    )
}

export default SearchResults
