import React, { useEffect, useState } from "react";
import { useBookingRoomMutation } from "../../services/bookingApi";
import { FaUser } from "../../utils/icons";
import { Loader } from "../layout";
import { Button } from "../core";
import { IRoom } from "../../models";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import moment from "moment";
import { getCookie } from "cookies-next";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
interface Props {
  hotelId: string;
}

interface RoomReserve extends IRoom {
  quantity: number;
}

const numberFormat = (e: any) =>
    new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND",
    }).format(e);

const RoomHotel = ({ hotelId }: Props) => {
    const [loading, setLoading] = useState(false);
    const [rooms, setRoom] = useState([]);
    const services = [
        "Phòng tắm thoải mái",
        "Vòi xịt",
        "Toilet",
        "Bồn tắm",
        "Vòi sen",
        "Khăn tắm",
        "Vải",
        "Không gây dị ứng",
        "Sàn đá/gạch men",
        "Bàn làm việc",
        "Ghế ngồi",
        "TV",
        "Dép đi trong nhà",
        "Tủ lạnh",
        "Điện thoại bàn",
        "Truyền hình cáp",
        "Máy sấy",
        "Điều hoà",
        "Tủ âm tường",
        "Ấm siêu tốc",
        "Tủ quần áo",
        "Bàn ăn",
        "Giá treo quần áo",
        "Giấy vệ sinh",
    ];

    const [roomsReserve, setRoomsReserve] = useState<RoomReserve[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [minimumcheckOut, setMiniMumCheckOut] = useState<Date>();
    const [peopleNumber, setPeopleNumber] = useState<number>(-1);
    const [bedNumber, setBedNumber] = useState<number>(-1);

    const router = useRouter();

    const handleDetailRoom = async () => {
        let token = getCookie("jwt_token")?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        let url = `/api/rooms?hotel_id=${hotelId}&check_in=${
            checkIn != undefined ? moment(checkIn).format("YYYY-MM-DD") : ""
        }&check_out=${
            checkOut != undefined ? moment(checkOut).format("YYYY-MM-DD") : ""
        }&people_number=${peopleNumber}&bed_number=${bedNumber}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token,
            }),
        });
        const data = await response.json();
        setRoom(data.data);
        // console.log( data);
        return data;
    };

    useEffect(() => {
        handleDetailRoom()
            .then((res) => res.json())
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [checkOut, checkIn, peopleNumber, bedNumber]);

    const onChangeSelect = (room: IRoom, quantity: number) => {
        if (quantity === 0) {
            roomsReserve.forEach((item, i) => {
                if (item.id === room.id) {
                    roomsReserve.splice(i, 1);
                    setTotal(total - item.quantity);
                    setPrice(price - item.quantity * item.price);
                }
            });
        } else {
            const check = roomsReserve?.every((item) => {
                return item.id !== room.id;
            });
            if (check) {
                setRoomsReserve([...roomsReserve, { ...room, quantity: quantity }]);
                setTotal(total + quantity);
                setPrice(price + quantity * room.price);
            } else {
                roomsReserve.forEach((item) => {
                    if (item.id === room.id) {
                        setTotal(total - item.quantity + quantity);
                        setPrice(
                            price - item.quantity * item.price + quantity * item.price
                        );
                        item.quantity = quantity;
                    }
                });
            }
        }
    };

    const handleCheckIn = (event: any) => {
        setCheckIn(new Date(moment(event.value).format("DD MMM YYYY")));
        const day = event.value ? event.value.getDate() + 1 : new Date().getDay;
        const month = event.value?.getMonth() + 1;
        const getFullYear = event.value?.getFullYear();
        const nextDate = new Date(
            getFullYear?.toString() + "-" + month?.toString() + "-" + day?.toString()
        );
        if (checkOut && checkIn && checkOut?.getDate <= checkIn?.getDate) {
            setCheckOut(nextDate);
        }

        setMiniMumCheckOut(nextDate);
    };

    const handleCheckOut = (event: any) => {
        setCheckOut(new Date(moment(event.value).format("DD MMM YYYY")));
        if (checkOut && checkIn && checkOut?.getDate < checkIn?.getDate) {
            setCheckIn(new Date(moment(event.value).format("DD MMM YYYY")));
        }
    };
    const Reserve = () => (
        <>
            {total > 0 ? (
                <div className="text-sm lg:text-base text-primary flex flex-col gap-y-0.5">
                    <p>
                        <span className="font-semibold ">{total}</span> phòng (Giá 1 đêm):
                    </p>
                    <h2 className="text-xl lg:text-3xl font-semibold">
                        {numberFormat(price)}
                    </h2>
                    <p className="text-xs lg:text-sm mb-2.5">Đã bao gồm thuế và phí</p>
                </div>
            ) : (
                <></>
            )}
        </>
    );

    const [
        bookingRoom,
        {
            isSuccess: isBookingSuccess,
            isError: isBookingError,
            error: bookingError,
        },
    ] = useBookingRoomMutation();

    const bookingBody: any = {
        hotelId: hotelId,
        roomId: roomsReserve[0]?.id,
        checkIn: checkIn,
        checkOut: checkOut,
        price: price,
        quantity: roomsReserve[0]?.quantity,
    };

    const booking = async () => {
        if (!checkIn || !checkOut || !bookingBody.roomId || !price) {
            toast.error("Please enter your check in, check out dates and room");
        } else {
            router.push({
                pathname: `/booking/${bookingBody.hotel_id}`,
                query: { roomsReserve: JSON.stringify(roomsReserve) ,
                    checkIn: JSON.stringify(checkIn),
                    hotel_id: hotelId,
                    checkOut: JSON.stringify(checkOut),
                    price: price},
            });
            console.log(roomsReserve);
        }
    };

    if (isBookingSuccess) {
        console.log(isBookingSuccess);

        router.push("/booking").then(() => toast.success("Booking Successfully"));
    }

    if (isBookingError) {
        toast.error(
            (bookingError as any)?.data?.message
                ? (bookingError as any).data.message
                : "Some thing went error"
        );
    }

    if (loading) {
        return (
            <div className="w-screen flex justify-center">
                <Loader />
            </div>
        );
    }
    return (
        <div>
            <div className="flex flex-wrap gap-6 p-2 mb-4 text-center font-medium">
                <label className="rounded-md">
                    <span>&nbsp;</span>
                    <div className="card flex justify-content-center rounded-md">
                        <span className="p-float-label rounded-3xl">
                            <Calendar
                                dateFormat="dd/mm/yy"
                                className="rounded-md"
                                inputId="Check in"
                                value={checkIn}
                                onChange={(e: CalendarChangeEvent) => handleCheckIn(e)}
                                minDate={new Date()}
                            />
                            <label htmlFor="check_in">Check in</label>
                        </span>
                    </div>
                </label>
                <label className="rounded-3xl">
                    <span>&nbsp;</span>
                    <div className="card flex justify-content-center ">
                        <span className="p-float-label">
                            <Calendar
                                dateFormat="dd/mm/yy"
                                inputId="Check out"
                                value={checkOut}
                                onChange={(e: CalendarChangeEvent) => setCheckOut(e.value ? new Date(e.value.toString()[0]) : new Date())}
                                minDate={minimumcheckOut}
                            />
                            <label htmlFor="check_out">Check out</label>
                        </span>
                    </div>
                </label>
                <label className="">
                    <span className="text-xs font-medium text-slate-500">Số người</span>
                    <div className="flex flex-row">
                        <div className="input-group-prepend">
                            <button
                                className="bg-transparent hover:bg-blue-300 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-300 hover:border-transparent rounded"
                                type="button"
                                onClick={() => setPeopleNumber(peopleNumber - 1)}
                            >
                -
                            </button>
                        </div>
                        <InputText
                            className="rounded focus-border:bg-blue-400 text-center form-control w-32 "
                            value={peopleNumber < 0 ? "2" : peopleNumber.toString()}
                            onChange={(e) => setPeopleNumber(e.target.valueAsNumber)}
                        />
                        <div className="input-group-prepend">
                            <button
                                className="bg-transparent hover:bg-blue-300 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-300 hover:border-transparent rounded"
                                type="button"
                                onClick={() => setPeopleNumber(peopleNumber + 1)}
                            >
                +
                            </button>
                        </div>
                    </div>
                </label>
                <label className="">
                    <span className="text-xs font-medium text-slate-500">Số giường</span>
                    <div className="flex flex-row">
                        <div className="input-group-prepend">
                            <button
                                className="bg-transparent hover:bg-blue-300 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-300 hover:border-transparent rounded"
                                type="button"
                                onClick={() => setBedNumber(bedNumber - 1)}
                            >
                -
                            </button>
                        </div>
                        <InputText
                            className="rounded focus-border:bg-blue-400 text-center form-control w-32 "
                            value={bedNumber < 0 ? "2" : bedNumber.toString()}
                            onChange={(e) => setBedNumber(e.target.valueAsNumber)}
                        />
                        <div className="input-group-prepend">
                            <button
                                className="bg-transparent hover:bg-blue-300 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-300 hover:border-transparent rounded"
                                type="button"
                                onClick={() => setBedNumber(bedNumber + 1)}
                            >
                +
                            </button>
                        </div>
                    </div>
                </label>
            </div>
            <div className="w-full flex flex-wrap rounded-md drop-shadow-lg">
                <div className="w-full xl:w-4/5 lg:w-full rounded-md drop-shadow-lg">
                    <div className="hidden md:grid grid-cols-12 bg-blue-400 text-white rounded-md drop-shadow-lg">
                        <div className="xl:col-span-5 lg:col-span-6 md:col-span-7 text-sm 2xl:text-base border border-l-0 border-blue-500 p-1.5 flex justify-center items-center text-center">
              Loại phòng
                        </div>
                        <div className="col-span-1 text-sm 2xl:text-base border border-l-0 border-blue-500 p-1.5 flex justify-center items-center text-center">
              Số người
                        </div>
                        <div className="xl:col-span-2 lg:col-span-1 text-sm 2xl:text-base border border-l-0 border-blue-500 p-1.5 flex justify-center items-center text-center">
              Giá 1 đêm
                        </div>
                        <div className="col-span-2 text-sm 2xl:text-base border border-l-0 border-blue-500 p-1.5 flex justify-center items-center text-center">
              Các lựa chọn
                        </div>
                        <div className="xl:col-span-2 lg:col-span-2 md:col-span-1 text-sm 2xl:text-base border border-l-0 border-blue-500 p-1.5 flex justify-center items-center text-center">
              Chọn số lượng
                        </div>
                    </div>
                    <div>
                        {rooms?.map((room: IRoom) => (
                            <div
                                key={room.id}
                                className="grid mt-2.5 md:mt-0 md:grid-cols-12"
                            >
                                <div className="xl:col-span-5 lg:col-span-6 md:col-span-7 text-sm 2xl:text-base border md:border-l-0 border-blue-500 p-1.5 flex md:justify-center items-center">
                                    <div>
                                        <h2 className="w-full font-semibold underline text-base 2xl:text-xl text-secondary w-max cursor-pointer">
                                            {room.name}
                                        </h2>
                                        <p className="my-2 w-full">{room.description}</p>
                                        <ul className="text-xs lg:text-sm flex flex-wrap gap-x-1.5">
                                            {services.map((service, index) => (
                                                <li key={index} className="mb-2">
                                                    <span className="text-green-500 mr-2">✓</span>
                                                    {service}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="md:col-span-1 text-sm 2xl:text-base border md:border-l-0 border-blue-500 p-1.5 flex md:justify-center items-center">
                                    <div className="flex md:grid md:grid-cols-2 gap-y-1.5">
                                        {[...Array(room.people_number)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-center"
                                            >
                                                <FaUser />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="xl:col-span-2 lg:col-span-1 text-sm 2xl:text-base border md:border-l-0 border-blue-500 p-1.5 flex md:justify-center items-center">
                                    <div>
                                        <p className="font-semibold text-base 2xl:text-xl break-all">
                                            {numberFormat(room.price)}
                                        </p>
                                        <p className="text-primary">Đã bao gồm thuế và phí</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 text-sm 2xl:text-base border md:border-l-0 border-blue-500 p-1.5 flex md:justify-center items-center">
                                    <div>
                                        <h2 className="font-semibold">Miễn phí huỷ trước 2 ngày</h2>
                                        <p>
                                            <span className="font-semibold uppercase">
                        HOÀN TRẢ 100%{" "}
                                            </span>
                      – thanh toán ngay
                                        </p>
                                        <p className="text-red-500">
                      Chỉ còn {room.quantity} phòng trống theo yêu cầu của bạn
                                        </p>
                                    </div>
                                </div>
                                <div className=" xl:col-span-2 lg:col-span-2 md:col-span-1 text-sm 2xl:text-base border md:border-l-0 border-blue-500 p-1.5 flex md:justify-center items-center">
                                    <select
                                        className="w-full rounded-md drop-shadow-lg"
                                        defaultValue={0}
                                        onChange={(event) => {
                                            onChangeSelect(room, Number(event.target.value));
                                        }}
                                    >
                                        <option value={0}>0</option>
                                        {Array.from(Array(room.quantity)).map((_, index) => (
                                            <option key={index} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right */}
                <div className="w-full xl:w-1/5 border md:border-l-0 border-blue-500">
                    <div className="bg-blue-400 text-sm 2xl:text-base border-b-2 border-blue-500 p-1.5 flex justify-center items-center">
            &nbsp;
                        <span className="lg:hidden">
                            <br />
              &nbsp;
                        </span>
                    </div>

                    <div className="p-2.5">
                        <Reserve />
                        <div onClick={() => booking()}>
                            <Button
                                text={"Tôi sẽ đặt"}
                                textColor="text-white"
                                bgColor="bg-primary"
                            />
                        </div>
                        <div className="text-primary text-sm xl:text-base mt-2.5">
                            <h2></h2>
                            <ul className="list-inside list-disc">
                                <li>Xác nhận tức thời</li>
                                <li>Không mất phí đặt phòng hay phí thẻ tín dụng!</li>
                            </ul>
                            <h2 className="text-center rounded-md text-green-500 font-medium text-xs lg:text-base border-2 border-green-500 mt-2.5 px-1.5 py-0.5">
                Thanh toán nhanh!
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomHotel;
