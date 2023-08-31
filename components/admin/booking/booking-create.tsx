import { Dropdown } from "primereact/dropdown";
import { Model } from "../../../interface";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import moment from "moment";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface Props {


    currentBooking: Model.Booking | null;
    onSave: () => void;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    hotels: Model.Hotel[];
    areas: Model.Branch[];
}

type FormErrors = {
    hotel_id: number;
    room_id: number;
    checkin: string;
    checkout: string;
    amount: number;
    total_amount: number;
    deposit_amount: number;
    room_data: any;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;

};

interface RoomData {
    id: number;
    quantity: number;
    amount: number;
}

const BookingCreate: React.FC<Props> = ({
    onSave,
    setVisible,
    currentBooking,
    hotels,
    areas
}) => {

    const [sortKeyHotel, setSortKeyHotel] = useState(null);
    const [sortKeyRoom, setSortKeyRoom] = useState(null);
    const [rooms, setRooms] = useState<Model.Room[]>([]);


    const [checkInData, setCheckInData] = useState("")
    const [checkOutData, setCheckOutData] = useState("")
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [minimumcheckOut, setMiniMumCheckOut] = useState<Date>();
    const [onClickSave, setOnClickSave] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [quantity, setQuantity] = useState([]);



    const [errors, setErrors] = useState<FormErrors>({
        hotel_id: 0,
        room_id: 0,
        checkin: '',
        checkout: '',
        amount: 0,
        total_amount: 0,
        deposit_amount: 0,
        room_data: [],
        first_name: '',
        last_name: '',
        phone: '',
        email: ''
    });



    const token = getCookie('jwt_token')?.toString();


    useEffect(() => {
        fetchRooms()
    }, []);

    // useEffect(() => {
    //     setQuantity([]);

    //     let roomQuantity: number = rooms.filter(room => room.id === sortKeyRoom).map(room => room.quantity).;

    //     for (var i = 1; i <= roomQuantity; i++) {
    //         // quantity.push(i);
    //     }



    // }, [sortKeyRoom]);

    const handleSubmit = (e: any) => {

    }

    const fetchRooms = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/rooms/get-list`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setRooms(data.data);

            // setResponseAPI({
            //     status: data.status,
            //     message: data.message,
            //     data: data.data,
            // });
        } catch (error) {
            console.error('Error:', error);
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

    const isFormFieldInvalid = (name: keyof FormErrors) => !!errors[name];


    const getFormErrorMessage = (name: keyof FormErrors) => {



        const error = errors[name];



        return isFormFieldInvalid(name) && onClickSave ? (
            <small className="p-error">{error}</small>
        ) : (
            <small className="p-error">&nbsp;</small>
        );
    };

    const validate = (data: any) => {
        let newErrors: any = {};

        if (!data.hotel_id) {
            newErrors.hotel_id = 'Vui lòng chọn khách sạn.';
        }

        if (!data.room_id) {
            newErrors.room_id = 'Vui lòng chọn phòng.';
        }
        if (!data.first_name) {
            newErrors.first_name = 'Tên không không được để trống.';
        }
        if (!data.last_name) {
            newErrors.last_name = 'Tên không được để trống.';
        }
        if (!data.phone) {
            newErrors.phone = 'Số điện thoại không được để trống.';
        }
        if (!data.email) {
            newErrors.email = 'Email không được để trống.';
        }
        console.log(data.checkin);

        if (!data.checkin) {
            newErrors.checkin = 'Vui lòng chọn ngày.';
        }
        if (!data.checkout) {
            newErrors.checkout = 'Vui lòng chọn ngày.';
        }

        return newErrors;
    };

    const handleSave = async () => {


        let value = {
            hotel_id: sortKeyHotel,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            checkin: checkIn,
            checkout: checkOut
        }

        const newErrors = validate({ ...value });

        setErrors(newErrors);
        setOnClickSave(true);

        // const bookingData = {
        //     user_id: 0,
        //     hotel_id: hotelId,
        //     check_in: checkInData.slice(0, checkInData.indexOf('T1')).replace('"', ''),
        //     check_out: checkOutData.slice(0, checkOutData.indexOf('T1')).replace('"', ''),
        //     status: 1,
        //     amount: price,
        //     total_amount: price,
        //     deposit_amount: price,
        //     room_data: roomData,
        //     first_name: firstName,
        //     last_name: lastName,
        //     phone: phone,
        //     email: email
        // };

        // const response = await fetch(`/api/bookings/create`, {
        //     method: "POST",
        //     headers: new Headers({
        //         "Content-Type": "application/json",
        //         Accept: "application/json",
        //         Authorization: token == undefined ? "" : token
        //     }),
        //     body: JSON.stringify(bookingData)
        // });
        // const data = await response.json();


        // return data;

    };


    return (
        <>
            <form onSubmit={(e) => { handleSubmit(e) }} >

                <div className="card p-fluid" >



                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputText id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" />
                            <label htmlFor="first_name" >Họ</label>
                        </span>

                    </div>
                    {getFormErrorMessage('first_name')}

                    <div className="field" >
                        <span className="p-float-label">
                            <InputText id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" />
                            <label htmlFor="last_name" >Tên</label>
                        </span>

                    </div>
                    {getFormErrorMessage('last_name')}

                    <div className="field" >
                        <span className="p-float-label">
                            <InputText id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="text" />
                            <label htmlFor="phone" >Số điện thoại</label>
                        </span>

                    </div>
                    {getFormErrorMessage('phone')}


                    <div className="field" >
                        <span className="p-float-label">
                            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
                            <label htmlFor="email">Email</label>
                        </span>

                    </div>
                    {getFormErrorMessage('email')}

                    <div className="flex justify-center">
                        <div style={{ flex: 1, margin: '0 10px' }}>
                            <label className="rounded-md">
                                <span>&nbsp;</span>
                                {/* <div className="card flex justify-content-center rounded-md"> */}
                                <span className="p-float-label rounded-32xl">
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
                                {/* </div> */}
                            </label>
                            {getFormErrorMessage('checkin')}
                        </div>



                        <div style={{ flex: 1, margin: '0 10px' }}>
                            <label className="rounded-3xl">
                                <span>&nbsp;</span>
                                {/* <div className="card flex justify-content-center "> */}
                                <span className="p-float-label">
                                    <Calendar
                                        dateFormat="dd/mm/yy"
                                        inputId="Check out"
                                        value={checkOut}
                                        onChange={(e: CalendarChangeEvent) => handleCheckOut(e)}
                                        minDate={minimumcheckOut}
                                    />
                                    <label htmlFor="check_out">Check out</label>
                                </span>
                                {/* </div> */}
                            </label>
                            {getFormErrorMessage('checkout')}
                        </div>


                    </div>

                    <div className="field" style={{ marginTop: '1rem' }}>
                        <Dropdown value={sortKeyHotel} options={hotels?.map(hotel => ({ label: hotel.name, value: hotel.id }))} optionLabel="label" placeholder="Khách sạn"
                            onChange={(e) => setSortKeyHotel(e.value)}
                            style={{ marginRight: '.5em' }} />
                    </div>
                    {getFormErrorMessage('hotel_id')}

                    {
                        sortKeyHotel ?
                            <>
                                <div className="field" >
                                    <Dropdown value={sortKeyRoom} options={sortKeyHotel ? rooms?.filter(room => room.hotel_id === sortKeyHotel).map(room => ({ label: room.name, value: room.id })) : []}
                                        optionLabel="label" placeholder="Phòng"
                                        onChange={(e) => setSortKeyRoom(e.value)}
                                        style={{ marginRight: '.5em' }} />
                                </div>
                                {/* <div className="field" >
                                    <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                                        editable placeholder="Select a City" className="w-full md:w-14rem" />
                                </div> */}

                                {/* {getFormErrorMessage('room_id')} */}

                            </>
                            : null
                    }



                </div >


            </form >

            <div className='button-save-cancel' style={{ textAlign: 'right', marginTop: '1rem' }}>
                <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisible(false); setOnClickSave(false); }} />
            </div>
        </>


    );
}

export default BookingCreate;