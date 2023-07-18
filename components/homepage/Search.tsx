import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import Button from '../core/Button'
import { IBranch } from '../../models/IBranch';

interface Props {
    branchesModel?: IBranch[];
}

const Search : React.FC<Props> = ({branchesModel})  => {
    const [city, setCity] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value)
    }

    const [branches, setBranches] = useState(branchesModel)
    const [branchId, setBranchId] = useState('1')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')

    async function getBranches() {
        const response: Response = await fetch("/api/branches", {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        });
        const data = await response.json();
        setBranches(data.data)
        return data.data
    }

    useEffect(() => {
        getBranches();
    }, []);


    return (
        <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-500" >
            <div className=" mx-auto container px-4 lg:px-6 relative ">
                <div className="text-white mx-2 mt-16 mb-48 sm:mb-32 lg:mb-28">
                    <h1 className="text-5xl font-bold ">Tìm chỗ nghỉ tiếp theo</h1>
                    <h3 className="mt-2 text-2xl font-thin">
                        Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
                    </h3>
                </div>
                <div
                    className="
                    absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    container px-4 lg:px-6 xl:px-40
                    "
                >
                    <div
                        className="self-start border-4 border-yellow-300 mx-auto w-full rounded-2xl bg-white flex flex-wrap items-end justify-center gap-2.5 p-2 pb-5 b h-40">
                        <div className='mb-8'>
                            <span className='ml-4 text-slate-600 text-sm'>Khu vực</span>
                            <div>
                                <div className="border border-zinc-500 border-neutral-950 w-full select-container rounded-md" > 
                                    <select className='form-input border-stone-800 border-2 block w-40 rounded-md border-0' onChange={(e) => {setBranchId(e.target.value);}}>
                                        {branches != null ? branches.map((option) => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        )): null}
                                    </select>
                                </div>
        
                            </div>
                        </div>
                        <div className="mb-8">
                            <span className='ml-4 text-slate-600 text-sm'>Check in</span>
                            <input type="date" className="border border-zinc-500 form-input block w-full rounded-md"  onChange={(e) => setCheckIn(e.target.value)}/>
                        </div>
                        <div className="mb-8">
                            <span className='ml-4 text-slate-600 text-sm'>Check out</span>
                            <input type="date" className="border border-zinc-500 form-input block w-full rounded-md" onChange={(e) => setCheckOut(e.target.value)}/>
                        </div>
                        <div className="mb-8">
                            <span className='ml-4 text-slate-600 text-sm'>Room</span>
                            <input type="number" className="form-input block rounded"/>
                        </div>
                    </div>
                </div>
                <div
                    className="
                    absolute z-50 left-1/2 transform -translate-x-1/4 mt-12
                    container px-4 lg:px-6 xl:px-40 
                    "
                >
                    <Link
                        href={`search/${branchId}`}
                    >
                        <div>
                            <Button
                                text="Tìm"
                                textColor="text-white"
                                width='w-80'
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Search
