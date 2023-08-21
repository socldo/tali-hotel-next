import { Disclosure } from '@headlessui/react'
import React, { useState, useEffect } from 'react'
import { IRoom } from '../../models'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from './Button'
import { getCookie } from 'cookies-next'
import { IBranch } from '../../models/IBranch'
import { Slider } from 'primereact/slider';
import { InputNumber } from 'primereact/inputnumber';
interface Props {
    room?: IRoom[];
    setHotelsType: any;
    branchesModel?: IBranch[];
    branchIdBf: string;
    branchNameBf: string;
}
const numberFormat = (e: any) =>
    new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    }).format(e);

const FilterHotels: React.FC<Props> = ({ branchIdBf, branchNameBf, branchesModel, room, setHotelsType }) => {
    const { register, watch } = useForm()

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
    const [values, setValues] = useState([0, 50000000]); // Giá trị mặc định

    const [rooms, setRooms] = useState(room)
    const [branchId, setBranchId] = useState(branchIdBf)
    const [branches, setBranches] = useState(branchesModel)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [peopleNumber, setPeopleNumber] = useState('-1')
    const [bedNumber, setBedNumber] = useState('-1')
    const [minPrice, setMinPrice] = useState('0')
    const [maxPrice, setMaxPrice] = useState('500000000')

    const onChangeValues = (event: any) => {
        setValues(event.value);
    };

    useEffect(() => {
        setMinPrice(values[0].toString());
        setMaxPrice(values[1].toString());
    }, [values])


    const [rating, setRating] = useState('-1')
    let token = getCookie('jwt_token')?.toString();

    const handleFilter = async () => {
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật

        let url = `/api/hotels?branch_id=${branchId}&check_in=${checkIn}&check_out=${checkOut}&people_number=${peopleNumber}&min_price=${minPrice}&max_price=${maxPrice}&avarage_rate=${rating}&bed_number=${bedNumber}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),

        });
        const data = await response.json();

        setRooms(data.data)
        return data;
    }
    useEffect(() => {
        handleFilter();
    }, [branchId, rating, values, bedNumber, peopleNumber]);

    // Trả kết quả ra cho ô export kết quả
    setHotelsType(rooms);


    async function getBranches() {
        const response: Response = await fetch("/api/branches", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        setBranches(data.data)
        return data.data
    }
    useEffect(() => {
        getBranches();
    }, []);
    const getValue = (number: any) => {
        switch (number) {
            case -1:
                return 0;

            case 0:
                return 1;

            default:
                return number;
        }
    };
    const { width } = useWindowDimensions()

    return (
        <><div><form className="shadow-xl w-full h-full p-5 bg-blue-100 rounded-md drop-shadow-2xl" autoComplete='off'>

            <Disclosure defaultOpen={(width > 1024)} >
                <div className="w-full" >
                    <label className="w-full">
                        <span className="text-sm float-left">Chi nhánh</span>
                        <div>
                            <div className="select-container" defaultValue={branchNameBf}>
                                <select className='form-input block w-full rounded-md border-0' defaultValue={branchNameBf} onChange={(e) => { setBranchId(e.target.value); }}>
                                    {branches != null ? branches.map((option) => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    )) : null}
                                </select>
                            </div>

                        </div>
                    </label>
                </div>
                <Disclosure.Panel>
                    <div className="w-full flex flex-col gap-1 ">
                        <div className="w-full flex flex-wrap gap-x-5 ">
                            <label className="flex-1">
                                <span className="text-sm">Check In</span>
                                <input type="date" className="form-input block w-full rounded-md border-0" onChange={(e) => setCheckIn(e.target.value)} />
                            </label>
                            <label className="flex-1">
                                <span className="text-sm">Check Out</span>
                                <input type="date" className="form-input block w-full rounded-md border-0" onChange={(e) => setCheckOut(e.target.value)} />
                            </label>
                        </div>
                        <label className="w-full">
                            <span className="text-sm">Số người</span>
                            <InputNumber className="block w-full rounded-md border-none" defaultValue={-1}
                                inputId="border-0 minmax-buttons" value={getValue(parseInt(peopleNumber))}
                                onValueChange={(e) => setPeopleNumber(e.value ? e.value.toString() : '-1')} mode="decimal"
                                showButtons min={-1} max={10}
                            />

                            {/* <input type="number" className="form-input block w-full rounded-md border-0" onChange={(e) => setPeopleNumber(e.target.value)}/> */}
                        </label>
                        <label className="w-full">
                            <span className="text-sm">Số giường</span>
                            <InputNumber className="block w-full rounded-md border-none" defaultValue={-1} inputId="border-0 minmax-buttons" value={getValue(parseInt(bedNumber))} onValueChange={(e) => setBedNumber(e.value ? e.value.toString() : '-1')} mode="decimal" showButtons min={-1} max={20} />
                        </label>
                        <div className="w-full flex flex-wrap gap-x-5">
                            <span className="text-sm">Ngân sách của bạn:<br></br> {numberFormat(values[0])} - {numberFormat(values[1])}</span>
                            <Slider
                                range
                                value={[values[0], values[1]]}
                                min={0}
                                max={5000000}
                                onChange={(e) => onChangeValues(e)}
                                style={{ width: '100%' }}
                                step={50000}
                                className='mt-2'
                            />
                        </div>

                        <Link
                            href={query}
                            onClick={() => handleFilter()}
                        >
                            <Button text={"Search"} bgColor="bg-lightPrimary"></Button>
                        </Link>

                    </div>

                </Disclosure.Panel>
            </Disclosure>
        </form>
        </div>
            <div className="shadow-xl border-2 mt-4 p-4">
                <h3 className="mb-4 font-bold border-b pb-4 text-xl">Filter by:</h3>
                <div className="flex flex-col">
                    <div className="flex-1">
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
                                            onChange={() => setRating("-1")}
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
                                                onChange={() => setRating((index + 1).toString())}
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
