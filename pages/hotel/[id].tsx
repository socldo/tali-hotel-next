import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
    MdLocationOn,
    AiFillHeart,
    FaParking,
    AiOutlineWifi,
    MdFamilyRestroom,
    MdAirportShuttle,
    MdSmokeFree,
    Ri24HoursFill,
    BsFillShareFill
} from '../../utils/icons'
import { Dialog, Transition } from '@headlessui/react'
import { Button, SearchVertical } from '../../components/core'
import { Layout, Loader } from '../../components/layout'
import { RoomHotel } from '../../components/room'
import StarRating from '../../components/core/StarRating'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { IRoom } from '../../models'
import { RiCupFill, RiCupLine, RiHandSanitizerLine } from 'react-icons/ri'
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria';
import { HotelReview, ImageGallery } from '../../components/hotel'

const HotelDetailPage = () => {
    const router = useRouter()

    
    const queryUrl = router?.query
    const branchSlug = queryUrl?.id ? queryUrl?.id[0] : ''

    const [roomId, setRoomId] = useState(branchSlug)
    const [images, setImages] = useState<string[]>([]);
    const [hotelId, setHotelId] = useState(0)
    const [branchId, setBranchId] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState(0)
    const [status, setStatus] = useState(0)
    const [rateCount, setRateCount] = useState(0)
    const [averageRate, setAverageRate] = useState(0)
    const [isHaveFreeWifi, setIsHaveFreeWifi] = useState(0)
    const [isHaveFreeParking, setIsHaveFreePaking] = useState(0)
    const [shortDescription, setShortDescription] = useState('')
    const [highlightProperty, setHighlightProperty] = useState('')
    const [totalReview, setTotalReview] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const responsiveOptions: GalleriaResponsiveOptions[] = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    const handleDetailRoom = async () => {

        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        let url = `/api/hotels/${branchSlug}`;

        
        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();

        // console.log( data);
        setHotelId(data.data.id)
        setBranchId(data.data.branch_id)
        setName(data.data.name)
        setDescription(data.data.description)
        setType(data.data.type)
        setPrice(data.data.price)
        setStatus(data.data.status)
        setRateCount(data.data.rate_count)
        setAverageRate(data.data.average_rate)
        setAddress(data.data.address)
        setShortDescription(data.data.short_description)
        setHighlightProperty(data.data.highlight_property)
        setTotalReview(data.data.total_reviews)
        setImages(data.data.images)   
  
        return data;
    }

    useEffect(() => {
        handleDetailRoom()
        console.log();
        
    },[])

    const scrollRef = useRef(null);

    const scrollToSection = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const itemTemplate = (item: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={item} alt={item} style={{ width: '100%', display: 'block' }} />;
    }

    const thumbnailTemplate = (item: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={item} alt={item} style={{ display: 'block' }} />;
    }
    
    return (
        <Layout
            metadata={{
                title: `${name} - Booking`,
                description: `${name} - Booking`
            }}
        >
            <div
                className="w-full my-4 mx-auto container px-4 lg:px-6 overflow-hidden"
                // onClick={() => {
                //     if (showModal) {
                //         setShowModal(false)
                //     }
                // }}
            >
                <div className="flex pt-2 gap-x-5">
                    {/* <div className="hidden lg:block w-1/5">
                        <SearchVertical />
                    </div> */}
                    <div className="w-full ">
                        <div>
                            <div className="flex justify-between flex-wrap">
                                <div className="flex gap-x-2">
                                    <p className="first-letter:uppercase text-sm text-white bg-gray-500 w-max h-max px-1.5 py-0.5 rounded">
                                        {type}
                                    </p>
                                    <StarRating data={averageRate} />

                                    <div
                                        className="items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg float-right lg:mb-4">
                                        {averageRate}.0
                                    </div>
                                </div>
                                <div className="text-secondary flex items-center gap-x-2.5">
                                    <div
                                        // onClick={wishListHandle}
                                        className="text-2xl cursor-pointer"
                                    >
                                        {/* {!isInWishList ? (
                                            <AiOutlineHeart />
                                        ) : (
                                            <AiFillHeart className="text-red-500" />
                                        )} */}
                                    </div>
                                    <div className="text-xl cursor-pointer">
                                        <BsFillShareFill />
                                    </div>
                                    <div onClick={scrollToSection}>
                                        <Button
                                            text="Đặt ngay"
                                            textColor="text-white"
                                            bgColor="bg-primary"
                                            
                                        />
                                    </div>
                                    <div 
                                        onClick={() => setShowModal(true)}
                                    >
                                        <Button
                                            text={'Đánh giá của khách'+ ' (' +totalReview + ')'}
                                            textColor="text-white"
                                            bgColor="bg-primary"
                                        />
                                    </div>
                                    {showModal ? (
                                        <HotelReview
                                            reviews={hotel?.reviews}
                                            id={hotelId}
                                            setShowModal={setShowModal}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <h1 className="my-2 text-xl font-bold">{name}</h1>
                        </div>
                        <div>
                            <div className="text-secondary flex flex-wrap gap-x-2.5 items-center mb-4">
                                <MdLocationOn />
                                <h2 className="text-primary">{address}</h2>
                                <p
                                    className="text-secondary cursor-pointer"
                                    // onClick={() => setShowMap(true)}
                                >
                                        Địa điểm tuyệt vời - Xem bản đồ
                                </p>
                            </div>
                        </div>

                        <div>
                            <ImageGallery photos={images} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-4/5 lg:w-4/5 py-5 text-justify">
                        <p >{description}</p>
                        <p>
                                Phù hợp cho các cặp đôi và hộ gia đình – Họ đã đánh giá
                            <span className="font-bold">{` ${averageRate} `}</span>
                                sao cho trải nghiệm tại đây.
                        </p>
                        <div className="mt-2">
                            <h2 className="font-bold text-lg">Các tiện nghi được ưa chuộng nhất</h2>
                            <ul className="flex flex-wrap gap-x-2.5 mt-4">
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <AiOutlineWifi />
                                    <p className="text-primary text-base">WiFi miễn phí</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <FaParking />
                                    <p className="text-primary text-base">Đậu xe miễn phí</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <MdFamilyRestroom />
                                    <p className="text-primary text-base">Phòng gia đình</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <MdAirportShuttle />
                                    <p className="text-primary text-base">Có xe đưa đón</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <MdSmokeFree />
                                    <p className="text-primary text-base">Phòng không hút thuốc</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <Ri24HoursFill />
                                    <p className="text-primary text-base">Hỗ trợ 24/24</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <RiCupLine />
                                    <p className="text-primary text-base">Máy pha trà/cà phê trong tất cả các phòng</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <RiCupLine />
                                    <p className="text-primary text-base">Bữa sáng rất tốt</p>
                                </li>
                                <li className="flex gap-x-1.5 items-center text-green-500 text-xl">
                                    <RiHandSanitizerLine />
                                    <p className="text-primary text-base">Trung tâm thể dục</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="rounded-lg bg-sky-200 mt-6 ml-12 w-full lg:w-1/6 inset-y-0 right-0">
                        <div className="text-black flex flex-col gap-y-2.5 p-2">
                            <h1 className="font-bold">Các tính năng nổi bật</h1>
                            <div className="flex items-center text-2xl">
                                <AiFillHeart className="w-1/6" />
                                <h2 className="text-sm w-5/6">{shortDescription}</h2>
                            </div>
                            <div className="flex items-center text-2xl">
                                <FaParking className="w-1/6" />
                                <h2 className="text-sm w-5/6">
                                    {highlightProperty}
                                </h2>
                            </div>
                            <div onClick={scrollToSection}>
                                <Button
                                    text="Đặt ngay"
                                    textColor="text-white"
                                    bgColor="bg-primary"
                                    fullWidth={true}
                                />
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div ref={scrollRef} className="mt-5 border-t border-current">
                    <div className="my-2.5 w-full">
                        <h1 className="font-bold text-2xl mb-4">Phòng trống</h1>
                        <RoomHotel hotelId={roomId} />
                    </div>
                </div>
            </div>
            {/* <Transition appear  as={Fragment} show={true}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => false}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-max transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                    <div>
                                        <MapContainer hotel={'hotel'} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition> */}
        </Layout>
    )
    
}

export default HotelDetailPage
