import Link from 'next/link'
import React, { useEffect } from 'react'
import {
    HiUser,
    AiOutlineUser,
    RiSuitcaseLine,
    AiOutlineWallet,
    AiOutlineHeart,
    VscSignOut,
    BiBed,
    MdOutlineAirplaneTicket,
    GiEarthAsiaOceania,
    AiOutlineCar,
    MdOutlineAttractions,
    RiTaxiWifiLine
} from '../../utils/icons'
import { Button } from '../core'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../features/authSlice'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { setBookings, setHotelWishList } from '../../features/appSlice'
import { deleteCookie, getCookie } from 'cookies-next'
import 'primeicons/primeicons.css';
import { FiShoppingCart } from 'react-icons/fi'

const Header = () => {
    const router = useRouter()
    console.log(router.pathname);

    useEffect(() => {
        if (router.pathname === '/auth') {
            // Thực hiện tác vụ khi người dùng truy cập vào trang /auth
            // ...
            console.log(1);
            
            // Ví dụ: Xóa cookie
            deleteCookie("jwt_token");
            deleteCookie("email");
            deleteCookie("phone");
            deleteCookie("name");
            deleteCookie("role");
            deleteCookie("jwtavatartoken");
        }
    }, []);

    const jwt_token = getCookie('jwt_token');
    console.log(jwt_token);
    
    const enableProfile = router.pathname === '/auth';
    console.log(enableProfile);
    
    const email = getCookie('email');
    const phone = getCookie('phone');
    const name = getCookie('name');
    const role = getCookie('role');
    const avatar = getCookie('avatar');

    
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        dispatch(logout())
        dispatch(setHotelWishList([]))
        dispatch(setBookings([]))
        toast.success('User logged out...')
        await router.push('/auth')
    }

    const handleSignOut = () => {
        deleteCookie("jet_token");
    }

    const accountMenu = [
        {
            icon: <AiOutlineUser />,
            name: 'Manage account',
            link: '/user'
        },
        {
            icon: <RiSuitcaseLine />,
            name: 'Bookings & Trips',
            link: '/user/booking'
        },
        {
            icon: <AiOutlineWallet />,
            name: 'Reward & Wallet',
            link: '/'
        },
        {
            icon: <AiOutlineHeart />,
            name: 'Saved',
            link: '/user/wishlist'
        }
    ]
    const menu = [
        {
            icon: <BiBed />,
            name: 'Stays',
            link: '/'
        },
        {
            icon: <MdOutlineAirplaneTicket />,
            name: 'Flights',
            link: '/'
        },
        {
            icon: <GiEarthAsiaOceania />,
            name: 'Flight + Hotel',
            link: '/'
        },
        {
            icon: <AiOutlineCar />,
            name: 'Car rentals',
            link: '/'
        },
        {
            icon: <MdOutlineAttractions />,
            name: 'Attractions',
            link: '/'
        },
        {
            icon: <RiTaxiWifiLine />,
            name: 'Airport taxis',
            link: '/'
        }
    ]

    return <header className="shadow-xl w-full border-b-2">
        <nav className=""> 
            <div className="flex flex-wrap justify-between items-center gap-2.5 mx-auto container px-4 lg:px-6 py-2.5 ">
                <Link href="/">
                    <span className="self-center text-3xl font-semibold whitespace-nowrap text-white"><img className='h-12' src="/tali-hotel-logo-black.png" alt="" /></span>
                </Link>
                {enableProfile != true ?                 <div className=" flex flex-end items-end gap-2 sm:gap-4">
                    {jwt_token
                        ? <>
                            <div
                                className="group inline-block relative">
                                    
                                <button
                                    className=" w-full px-2 flex items-center text-black gap-1 ">
                                    {avatar 
                                        ?<>
                                            <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={avatar.toString()} alt="Bordered avatar"></img>
                                        </>
                                        :
                                        <div
                                            className="w-8 h-8 border-2 border-orange-500 rounded-full
                                            flex items-center justify-center
                                            overflow-hidden">
                                            <HiUser size={30} />
                                        </div>}
                                    
                                    <span className="ml-2 font-medium hidden md:block">Xin chào {name}</span>

                                </button>
                                <ul className="shadow-2xl w-max absolute z-50 right-0 hidden text-black pt-2 group-hover:block">
                                    {accountMenu.map(item =>
                                        <li key={item.name}
                                            className="font-semibold bg-white hover:bg-gray-300 block whitespace-no-wrap">
                                            <Link href={`${item.link}`}
                                                className=" flex items-center py-2 px-4 gap-x-2.5 ">
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    )}
                                    <li
                                        className="bg-white hover:bg-gray-300 block whitespace-no-wrap">
                                        <div onClick={() => handleLogout()}
                                            className="flex items-center py-2 px-4 gap-x-2.5 cursor-pointer">
                                            <VscSignOut />
                                            <span>Sign out</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </>
                        : <>

                            <Link href="/auth" onClick={handleSignOut}>
                                <Button text="Đăng nhập" textColor="text-primary" bgColor="bg-white" focusHandle="hover:bg-gray-300"/>
                            </Link>

                        </>}
                </div> : <></>}

            </div>
        </nav>
        <nav className="bg-blackhidden sm:block px-2 lg:px-4 py-2.5">
            <ul className="mx-auto container flex flex-wrap justify-center items-center gap-x-2 text-black">
                {menu.map(item =>
                    <li key={item.name}
                        className="font-semibold rounded-3xl hover:bg-gray-500 hover:bg-opacity-25 whitespace-no-wrap">
                        <Link href={`${item.link}`} className="flex items-center gap-x-2.5 py-2 px-4 ">
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    </header>
}

export default Header
