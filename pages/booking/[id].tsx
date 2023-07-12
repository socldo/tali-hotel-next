import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";
import { IHotel, IRoom } from "../../models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import moment from "moment";
import { Image } from 'primereact/image';
import { getCookie } from "cookies-next";
import StarRating from "../../components/core/StarRating";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "@material-tailwind/react";
import { Button } from "../../components/core";
import ButtonNext from "../../components/core/ButtonNext";
import querystring from 'querystring';

interface Props {
  room: IRoom[];
  checkIn: string;
  checkOut: string;
}

interface RoomReserve extends IRoom {
  quantity: number;
}

const numberFormat = (e: any) =>
    new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND",
    }).format(e);

const formatBookingDate= (date: Date) => {
    const dayOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
    const dayOfMonth = date.getDate();
    const monthNames = ["", "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"];
    const monthName = monthNames[date.getMonth() + 1];
    const year = date.getFullYear();
    
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthName} ${year}`;
    return formattedDate;
}

const differentDate = (checkIn: Date, checkOut: Date) => {
    return checkOut.getDate() - checkIn.getDate();
}



const Booking = ( roomData : RoomReserve[], hotel : IHotel) => {
    const router = useRouter();
    const bookingData = Array.isArray(router.query.roomsReserve)
        ? router.query.roomsReserve.map((item) => JSON.parse(item))
        : JSON.parse(router.query.roomsReserve || '[]');
    console.log(router.query);
        
    const checkIn = formatBookingDate(new Date(JSON.parse(router.query.checkIn ? router.query.checkIn : ""))) ;

    const checkOut =formatBookingDate(new Date(JSON.parse(router.query.checkOut ? router.query.checkOut  : ""))) ;

    const totalDate = differentDate(new Date(JSON.parse(router.query.checkIn)), new Date(JSON.parse(router.query.checkOut)));

    const hotelId = router.query.hotel_id;

    const price: number = Array.isArray(router.query.price)
        ? parseInt(router.query.price ? router.query.price[0] : "0")
        : parseInt(router.query.price ? router.query.price : "0");

    /**
     * hotel data
     */
    const [images, setImages] = useState<string[]>([]);
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


    /**
     * booking data
     */
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [bookingFor, setBookingFor] = useState(0)

    /**
     * Step
     */
    const [step, setStep] = useState(1)
    
    /**
     * Step
     */
    // const [paymentName, setPaymentName] = useState('')
    // const [bank, setLastName] = useState('')
    // const [phone, setPhone] = useState('')
    // const [email, setEmail] = useState('')

    const changeOption = () => {
        router.push(`/hotel/${hotelId}`)
    }

    const handleDetailRoom = async ( ) => {

        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật

        const url = `/api/hotels/${hotelId}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        console.log('data id', url);
        
        if (data.data) {
            setHotelId( data.data.id)
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
        }
  
        console.log(type);
        
        return data;
    }

    useEffect(() => {
        handleDetailRoom()
    }, [])

    const handlePayment = async () => {
        const vnp_CreateDate = moment(new Date()).format("yyyyMMddHHmmss")
        const vnp_Amount = price*totalDate;
        const queryParams = querystring.stringify({ vnp_Amount, vnp_CreateDate});
        console.log(queryParams);
        
        router.push(`https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${vnp_Amount}&vnp_Command=pay&vnp_CreateDate=20230711153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42`)
    }
    

    const items: MenuItem[] = [
        {
            label: "Bạn chọn",
            className: "text-blue-500",
        },
        {
            label: "Chi tiết về bạn",
            className: "text-blue-500",
        },
        {
            label: "Bước cuối cùng",
            className: "text-blue-500",
        },
    ];
    return (
        <div className="mr-11 ml-11">
            <div className="mr-48 ml-48">
                <div className="mt-2 text-blue-600">
                    <Steps
                        className="p-steps-title text-blue-500"
                        model={items}
                        activeIndex={step}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="grid grid-cols-1 flex content-start">
                        <div className="border m-2 px-5 py-3 flex-none">
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
                                <p className="mt-1 mb-4 text-sm font-bold">{totalDate} đêm</p>
                            </div>
                            <div>
                                <p className="mt-4 text-sm font-bold">Bạn đã chọn</p>
                                {bookingData?.map((bookingData: RoomReserve) => (<p className="mt-2 text-sm">{bookingData.quantity} x {bookingData.name} </p>))}
                                <div className="mb-2 mt-2 text-sm font-bold text-sky-500" onClick={changeOption}>
                                    <Button                                   
                                        text="Đổi lựa chọn của bạn"
                                        textColor="text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="border m-2 px-5 py-3 ml 8">
                            <p className="font-bold">Tóm tắt giá</p>
                            <div className="pt-4 flex justify-between">
                                <div>
                                    <p className="text-2xl font-semibold">Giá</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{numberFormat(price*totalDate)}</p>
                                    <p className="text-sm">+ 0đ thuế và phí</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 flex flex-col py-2 border-round">
                        <div className="border container">
                            <div className="m-4">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="grid grid-cols-1">
                                        <Image
                                            width="500"
                                            height="500"
                                            src="https://images.unsplash.com/photo-1620814153812-38115a7f0fbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                                            preview
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex flex-row items-center">
                                            <p className="text-sm mr-2">{type}</p>
                                            <StarRating data={averageRate} />
                                            <i className="ml-2 pi pi-thumbs-up text-amber-400" style={{ fontSize: '1rem' }}></i>
                                        </div>
                                        <p className="mt-2 font-bold">{name}</p>
                                        <p className="mt-2 text-xs mr-2 text-green-700">Vị trí tuyệt vời {averageRate}.0/5</p>
                                        <p className="mt-2 text-xs mr-2">
                                            <i className="ml-2 mr-2 pi pi-comments text-amber-400" style={{ fontSize: '1rem' }}></i>
                                            {totalReview} đánh giá</p>
                                        <p className="mt-2 text-xs mr-2">
                                            {highlightProperty}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="mt-4 border container">
                            <div className="m-4">
                                <p className="text-lg font-bold">Mách nhỏ:</p>
                                <p className="text-sm mt-2"><i className="pi pi-car text-green-600 mr-2" style={{ fontSize: '1rem' }}></i> 
                                Tận hưởng ưu đãi 5% cho xe thuê khi đặt kỳ nghỉ này</p>
                                <p className="text-sm mt-2"><i className="pi pi-clock text-red-600 mr-2" style={{ fontSize: '1rem' }}></i> 
                                Bạn đang đặt {bookingData[0].name} cuối cùng còn trống chúng tôi có ở {name}.</p>
                            </div>
                        </div>
                        <div className="mt-4 border container">
                            <div className="m-4">
                                <p className="test-sm">Dễ dàng đặt phòng cho lần sau hơn khi bạn là thành viên thân thiết của Tali Hotel</p>
                                <div className="flex flex-row ">
                                    <Link href="/auth">
                                        <p className="mt-2 text-blue-400 test-sm hover:underline">Đăng nhập</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {step == 1 ?                
                            <>        
                                <div className="mt-4 border container">
                                    <div className="m-4">
                                        <p className="text-lg font-bold">Nhập thông tin chi tiết của bạn</p>
                                        <div className="mt-2 flex flex-row bg-green-100 w-80 items-center">
                                            <p className="ml-2 text-xs text-green-700 ">Gần xong rồi! Chỉ cần điền phần thông tin </p>
                                            <p className="text-red-500 ml-1 mr-1">*</p>
                                            <p className="text-xs text-green-700">bắt buộc</p>
                                        </div>
                                        <div className="mt-4 flex flex-row">
                                            <div className="w-72">
                                                <div className="relative h-10 w-full min-w-[200px]">
                                                    <input
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                        placeholder=" "
                                                    />
                                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                Họ  <span className="text-red-500"> *</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="ml-2 w-72">
                                                <div className="relative h-10 w-full min-w-[200px]">
                                                    <input
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                        placeholder=" "
                                                    />
                                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500" >
                                                        <p >Tên <span className="text-red-500">*</span></p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 relative h-10 w-80 min-w-[200px]">
                                            <input
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                placeholder=" "
                                            />
                                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                Số điện thoại  <span className="text-red-500">  *</span>
                                            </label>
                                        </div>
                                        <div className="mt-4 relative h-10 w-80 min-w-[200px]">
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                placeholder=" "
                                            />
                                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                Email <span className="text-red-500">  *</span>
                                            </label>
                                        </div>
                                        <p className="ml-4 mt-4 text-xs text-slate-500">Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này</p>
                                        <p className="ml-4 mt-4 text-sm font-bold">Bạn đặt phòng cho ai?</p>
                                        <div className="items-center flex flex-row text-sm">
                                            <Checkbox color="blue" defaultChecked={false} checked={bookingFor == 1 ? true : false} onResize={undefined} onResizeCapture={undefined} onChange={() => setBookingFor(1)}/>
                                            <p className="items-center text-sm">Tôi là khách lưu trú chính </p>
                                        </div>
                                        <div className="items-center flex flex-row text-sm">
                                            <Checkbox color="blue" defaultChecked={false} onResize={undefined} checked={bookingFor == 2 ? true : false} onResizeCapture={undefined} onChange={() => setBookingFor(2)}/>
                                            <p className="items-center">Đặt phòng này là cho người khác</p>
                                        </div>

                                    </div>

                            
                                </div> 
                                <div className="mt-4 w-120 grid justify-items-end">
                                    <div onClick={() => setStep(2)}>
                                        <ButtonNext text="Bước tiếp theo" textColor="text-white" bgColor="bg-blue-500" focusHandle="hover:bg-gray-300"/>
                                    </div>
                                                   
                                </div>
                            </>
                            :
                            <div className="mt-4 border container">
                                <div className="m-4">
                                    <p className="text-lg font-bold">Chọn phương thức thanh toán</p>
                                    <div className="mt-2 flex flex-row bg-green-100 w-80 items-center">
                                        <p className="ml-2 text-xs text-green-700 ">Thanh toán ngay! Chúng tôi cam kết hoàn tiền 100%</p>
                                    </div>
                                    
                                    <div>                                        
                                        <div className="items-center flex flex-row text-sm">
                                            <Checkbox color="blue" defaultChecked={false} checked={bookingFor == 1 ? true : false} onResize={undefined} onResizeCapture={undefined} onChange={() => setBookingFor(1)}/>
                                            <p className="items-center text-sm">Chuyển khoản ngân hàng</p>
                                        </div>
                                        <div className="items-center flex flex-row text-sm">
                                            <Checkbox color="blue" defaultChecked={false} onResize={undefined} checked={bookingFor == 2 ? true : false} onResizeCapture={undefined} onChange={() => setBookingFor(2)}/>
                                            <p className="items-center">Thanh toán bằng momo</p>
                                        </div>
                                    </div> 
                                    <div className="mt-4 w-120 grid justify-items-start">
                                        <div onClick={() => handlePayment()}>
                                            <Button text="Thanh toán ngay" textColor="text-white" bgColor="bg-blue-500" focusHandle="hover:bg-gray-300"/>
                                        </div>
                                                   
                                    </div>

                                </div>

                    
                            </div> 
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
