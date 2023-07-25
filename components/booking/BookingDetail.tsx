import React, { useEffect, useState } from "react";
import {
    usePostReviewMutation,
    useDeleteReviewMutation,
    useUpdateReviewMutation,
} from "../../services/hotelApi";
import moment from "moment";
import { Button } from "../../components/core";
import { AiOutlineClose, CiEdit, MdLocationOn } from "../../utils/icons";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hooks";
import Link from "next/link";
import { getCookie } from "cookies-next";
import StarRating from "../core/StarRating";
import { IRoom } from "../../models";
import { Image } from 'primereact/image';
import { Tag } from "primereact/tag";
import { differenceInDays, parseISO } from 'date-fns';

const numberFormat = (e: any) =>
    new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND",
    }).format(e);

const BookingDetail = ({ id}: any) => {

    const [images, setImages] = useState<string>('');
    const [hotelIdPerOne, setHotelId] = useState(0)
    const [branchId, setBranchId] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [type, setType] = useState('')
    const [pricePerOne, setPrice] = useState(0)
    const [status, setStatus] = useState(0)
    const [rateCount, setRateCount] = useState(0)
    const [averageRate, setAverageRate] = useState(0)
    const [isHaveFreeWifi, setIsHaveFreeWifi] = useState(0)
    const [isHaveFreeParking, setIsHaveFreePaking] = useState(0)
    const [shortDescription, setShortDescription] = useState('')
    const [highlightProperty, setHighlightProperty] = useState('')
    const [totalReview, setTotalReview] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [reviews, setReviews] = useState()
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [roomData, setRoomeData] = useState<IRoom[]>([])
    const [totalDate, setTotalDate] = useState(0)
    const [hotelId, setHotelParamId] = useState(0)
    const [amount, setAmount] = useState(0)

    const [hotelName, setHotelName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [bookingPhone, setBookingPhone] = useState("")
    const [bookingEmail, setBookingEmail] = useState("")

    const apiGetBooking = async () => {

        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        let url = `/api/bookings/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        setHotelId(data.data.id)

        
        setBranchId(data.data.branch_id)
        setName(data.data.name)
        setDescription(data.data.description)
        setType(data.data.type)
        setStatus(data.data.status)
        setAmount(data.data.amount)
        setCheckIn(data.data.checkin_date)
        setCheckOut(data.data.checkout_date)
        setFirstName(data.data.first_name)
        setLastName(data.data.last_name)
        setBookingPhone(data.data.phone)
        setBookingEmail(data.data.email)
        // apiGetHotel(data.data.id);

        let url2 = `/api/hotels/${data.data.hotel_id}`;

        const response2 = await fetch(url2, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data2 = await response2.json();
        if(data2.data) {
            setImages(data2.data.images[0])
            setHotelName(data2.data.name)
            setAverageRate(data2.data.average_rate)
            setAddress(data2.data.address)
            setDescription(data2.data.description)
            setPhone(data2.data.phone)
            setEmail(data2.data.email)
        }

        let urlRoom = `/api/rooms?booking_id=${id}`;
        console.log(urlRoom);
        const responseRooms = await fetch(urlRoom, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const dataRooms = await responseRooms.json();
        console.log(dataRooms);
        
        setRoomeData(dataRooms.data);
        return data.data.id;
    }

    useEffect(() => {
        apiGetBooking();
        // apiGetHotel(hotelId);
    }, [])



    const differentDate = (checkIn: string, checkOut: string) => {
        const start = parseISO(checkIn);
        const end = parseISO(checkOut);
        const days = differenceInDays(end, start);
        return days;
    }
    
    return (
        <>
            <div className="rounded-lg shadow-xl card flex flex-col lg:flex-row gap-1 border p-5 mb-5">
                <div className="rounded-lg w-full h-full lg:w-1/4 object-cover">
                    <Image
                        width="500"
                        height="500"
                        src={images}
                        preview
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between lg:flex-row gap-1">
                    <div className="flex-auto w-64 lg:mx-4">
                        <div className="flex flex-wrap gap-1">
                            <p className="text-xl font-bold text-secondary">
                                {hotelName}
                            </p>                                   
                        </div>
                        <StarRating data={averageRate} />
                        <div className="text-sm underline text-secondary flex items-center flex-wrap gap-2">
                            <MdLocationOn />
                            <span className="cursor-pointer capitalize">
                                {address}
                            </span>
                            <span className="cursor-pointer flex-wrap">
                                        Show on map
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <p className="text-justify text-sm mt-2 flex items-center flex-wrap gap-1">{description}</p>                                
                        </div>

                    </div>
                    <div
                        className="basic-1/4 font-semibold flex flex-row lg:flex-col justify-between items-center lg:items-end ">
                    </div> 
                    <div className="basic-1/4 font-semibold flex flex-row lg:flex-col justify-between items-center lg:items-end "></div> 
                                
                </div>
            </div>
            <div className="border-b">
                <p className="font-bold">Chi tiết đặt phòng của bạn</p>
                <div className="mt-4 flex">
                    <div className="border-r-2 flex-1 mr-4">
                        <p className="text-sm">Nhận phòng</p>
                        <p className="mt-2 mr-4 font-bold text-base">{checkIn}</p>
                        <p className="text-sm text-slate-500">Từ 13:00</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm">Trả phòng</p>
                        <p className="mt-2 mr-4 font-bold text-base">{checkOut}</p>
                        <p className="text-sm text-slate-500">Cho đến 12:00</p>
                    </div>
                </div>
                <p className="mt-2 text-sm">Tổng thời gian lưu trú:</p>
                <p className="mt-1 mb-4 text-sm font-bold">{differentDate(checkIn, checkOut)} đêm </p>

                <p className="text-sm">Số điện thoại chỗ nghỉ: <span className="text-blue-500"> {phone}</span></p>
                <p className="text-sm">Email chỗ nghỉ: <span className="text-blue-500"> {email}</span></p>
                <p className="mt-4  text-sm font-bold">Loại phòng</p>
                <p className="text-sm">{roomData && Array.isArray(roomData) && roomData.length > 0 ? (
                    roomData.map((bookingData: IRoom) => (
                        <p key={bookingData.id} className="text-sm">
                            {bookingData.quantity} x {bookingData.name}
                        </p>
                    ))
                ) : (
                    <p>Không có dữ liệu phòng.</p>
                )}</p>
                <p className="mt-4  text-sm font-bold">Lợi ích</p>
                <p className="text-sm">Wi-Fi,Nước uống,Bãi đậu xe,WiFi miễn phí</p>
                <p className="mt-4  text-sm font-bold">Thông tin về khách</p>
                <p className="text-sm">{firstName} {lastName}</p>
                <p className="text-sm">Số điện thoại khách: <span className="text-blue-500"> {bookingPhone}</span></p>
                <p className="text-sm">Email khách: <span className="text-blue-500"> {bookingEmail}</span></p>
                <p className="mt-4  text-sm font-bold">Thông tin thanh toán</p>
                <p className="text-sm">Tổng tiền: <span className="text-blue-500"> {numberFormat(amount)}</span></p>
                <p className="text-sm ">Bao gồm : Thuế và phí</p>
                <p className="text-sm ">Trạng thái:  <span className="text-blue-500">Đã thanh toán</span></p>
            </div>
        </>
    );
};


export default BookingDetail;
