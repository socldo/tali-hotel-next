import {Disclosure} from '@headlessui/react'
import React, {useState, useEffect} from 'react'
import {IHotel, IRoom} from '../../models'
import {useAppSelector} from '../../store/hooks'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from './Button'

interface Props {
    room?: IRoom[];
    setHotelsType: any;
}

const FilterHotels: React.FC<Props> = ({room, setHotelsType}) => {
    const {register, watch} = useForm()

    const router = useRouter()
    const queryUrl = router?.query

    const citySlug = queryUrl?.slug ? queryUrl?.slug[0] : ''
    const minSlug = queryUrl?.min
    const maxSlug = queryUrl?.max

    const city = watch('city') || citySlug
    const min = watch('min') || minSlug
    const max = watch('max') || maxSlug

    let query = `/search/${city}`
    if (min) query += `?min=${min}`
    if (max) query += `&max=${max}`

    // const {width} = useWindowDimensions()
    const [rooms, setRooms] = useState(room)
    const [branchId, setBranchId] = useState('-1')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [peopleNumber, setPeopleNumber] = useState('-1')
    const [minPrice, setMinPrice] = useState('0')
    const [maxPrice, setMaxPrice] = useState('999999999')

    const [rating, setRating] = useState('-1')

    const handleFilter = async () => {
        let token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMzcyMjAyODA3IiwiaWF0IjoxNjg2ODMyMzc4LCJleHAiOjE2ODY5MTg3Nzh9.NnXteOvj9agvBgb3hs3UYvgDuVqH2UVKonMX5xti76DC1f4MhNUQ0_D5c6vL_VlWyagWVKfhP5x-KS3sr0YvCg'
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        let url = `/api/rooms?branch_id=${branchId}&check_in=${checkIn}&check_out=${checkOut}&people_number=${peopleNumber}&min_price=${minPrice}&max_price=${maxPrice}&avarage_rate=${rating}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token
            }),
            
        });
        const data = await response.json();
        console.log( url);
        console.log( data);
        setRooms(data.data)
        return data;
    }
    useEffect(() => {
        handleFilter();
    }, [rating]);


    setHotelsType(rooms);

    // const {hotels: hotelsRedux} = useAppSelector(
    //     (state) => state.persistedReducer.hotel
    // )
    // const types = hotelsRedux
    //     ?.map((hotel) => hotel.type)
    //     .filter((value, index, self) => self.indexOf(value) === index)

    // const [type, setType] = useState('all')
    // const [rating, setRating] = useState('all')

    // useEffect(() => {
    //     const getHotelsFilter = () => {
    //         if (type !== 'all') {
    //             if (rating !== 'all') {
    //                 const hotelsFilter = hotels?.filter(
    //                     (el) => el.type === type && el.rating && Math.round(el.rating) === +rating
    //                 )

    //                 setHotelsType(hotelsFilter)
    //             } else {
    //                 const hotelsFilter = hotels?.filter((el) => el.type === type)

    //                 setHotelsType(hotelsFilter)
    //             }
    //         } else if (rating !== 'all') {
    //             const hotelsFilter = hotels?.filter(
    //                 (el) => el.rating && Math.round(el.rating) === +rating
    //             )

    //             setHotelsType(hotelsFilter)
    //         } else {
    //             setHotelsType(hotels)
    //         }
    //     }

    //     getHotelsFilter()
    // }, [hotels, type, rating, setHotelsType])

    // const handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setType(e.target.value)
    // }

    // const handleChangeRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setRating(e.target.value)
    // }
    // const handleChangeCheckIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setCheckIn(e.target.value)
    // }
    // const handleChangeCheckOut = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setCheckOut(e.target.value)
    // }
    // const handleChangePeopleNumber= (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setPeopleNumber(e.target.value)
    // }
    // const handleChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setMinPrice(e.target.value)
    // }
    // const handleChangeMaxPrice= (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setMaxPrice(e.target.value)
    // }

    const {width} = useWindowDimensions()

    return (
        <><div><form className="w-full h-full p-5 bg-secondary">
            <Disclosure defaultOpen={(width > 1024)}>
                <Disclosure.Button className="w-full">
                    <label className="w-full">
                        <span className="text-sm float-left">Location</span>
                        <input
                            className="form-input block w-full "
                            {...register('city')}
                            placeholder="Where are you going?"
                            defaultValue={city}
                            onChange={(e) => setBranchId(e.target.value)}
                        />
                    </label>
                </Disclosure.Button>
                <Disclosure.Panel>
                    <div className="w-full flex flex-col gap-1">
                        <div className="w-full flex flex-wrap gap-x-5">
                            <label className="flex-1">
                                <span className="text-sm">Check In</span>
                                <input type="date" className="form-input block w-full"  onChange={(e) => setCheckIn(e.target.value)}/>
                            </label>
                            <label className="flex-1">
                                <span className="text-sm">Check Out</span>
                                <input type="date" className="form-input block w-full" onChange={(e) => setCheckOut(e.target.value)}/>
                            </label>
                        </div>
                        <label className="w-full">
                            <span className="text-sm">People Number</span>
                            <input type="number" className="form-input block w-full" onChange={(e) => setPeopleNumber(e.target.value)}/>
                        </label>
                        <div className="w-full flex flex-wrap gap-x-5">
                            <label className="flex-1">
                                <span className="text-sm">Min Price</span>
                                <input
                                    type="number"
                                    className="form-input block w-full"
                                    {...register('min')}
                                    defaultValue={min}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm">Max Price</span>
                                <input
                                    type="number"
                                    className="form-input block w-full"
                                    {...register('max')}
                                    defaultValue={max}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </label>
                        </div>

                        <Link
                            href={query}
                            className={
                                !watch('city') ? 'pointer-events-none cursor-not-allowed' : ''
                            } 
                            onClick={() =>handleFilter()}              
                        >
                            <div className="w-full">
                                <Button
                                    text="Search"
                                    textColor="text-white"
                                    bgColor="bg-lightPrimary"
                                    fullWidth={true}
                                    
                                />
                            </div>
                        </Link>
                    </div>

                </Disclosure.Panel>
            </Disclosure>
        </form>
        </div>
        <div className="border-2 mt-4 p-4">
            <h3 className="mb-4 font-bold border-b pb-4 text-xl">Filter by:</h3>
            <div className="flex flex-col">
                <div className="flex-1">
                    <Disclosure defaultOpen={(width > 1024)}>
                        {/* <Disclosure.Button>
                            <h4 className="mb-4 font-bold">Type</h4>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            <ul className="w-48 text-sm font-medium">
                                <div className="flex items-center mb-4">
                                    <input
                                        id="all"
                                        type="radio"
                                        name="type"
                                        className="w-4 h-4"
                                        value="all"
                                        onChange={() =>setRating("-1")}
                                    />
                                    <label htmlFor="all" className="ml-2 text-sm font-medium capitalize">
                                        All
                                    </label>
                                </div>
                            </ul>
                        </Disclosure.Panel> */}
                    </Disclosure>
                </div>
                <div className="flex-1">
                    <Disclosure defaultOpen={(width > 1024)}>
                        <Disclosure.Button>
                            <h4 className="mb-4 font-bold">Star</h4>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                            <ul className="w-48 text-sm font-medium">
                                <div className="flex items-center mb-4">
                                    <input
                                        id="all"
                                        type="radio"
                                        name="rating"
                                        className="w-4 h-4"
                                        onChange={() =>setRating("-1")}
                                        value="all"
                                    />
                                    <label htmlFor="all" className="ml-2 text-sm font-medium capitalize">
                                        All
                                    </label>
                                </div>
                                {Array.from(Array(5)).map((item, index) => (
                                    <div className="flex items-center mb-4" key={index}>
                                        <input
                                            id={index.toString()}
                                            type="radio"
                                            name="rating"
                                            className="w-4 h-4"
                                            onChange={() =>setRating(index.toString())}
                                            value={index + 1}
                                        />
                                        <label
                                            htmlFor={index.toString()}
                                            className="ml-2 text-sm font-medium capitalize"
                                        >
                                            {index + 1} stars
                                        </label>
                                    </div>
                                ))}
                            </ul>
                        </Disclosure.Panel>
                    </Disclosure>
                </div>

            </div>
        </div>
        </>
        
    )
}

export default FilterHotels
