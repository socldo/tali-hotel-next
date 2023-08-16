import React, {useEffect, useState} from 'react'
import Types from './Types'
import Hotels from './Hotels'
import {useAppDispatch} from '../../store/hooks'
import {useGetHotelsQuery} from '../../services/hotelApi'
import {setHotels} from '../../features/hotelSlice'
import {Loader} from '../layout'

const HotelType = () => {
    const dispatch = useAppDispatch()
    const {data: hotels, isLoading, isSuccess} = useGetHotelsQuery({})
    const [type, setType] = useState('all')
    useEffect(() => {
        if (isSuccess) {
            dispatch(
                setHotels({hotels})
            )
        }
    }, [dispatch, hotels, isSuccess])

    if (isLoading) {
        return (
            <div className="w-full mt-20 flex items-center justify-center">
                <Loader/>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-y-5">
            <div>
                <h1 className="font-bold text-2xl text-black">Đặt phòng nhanh chóng và dễ dàng</h1>
                <h2 className="text-primary font-light text-xl">
                    Chọn một sự rung cảm và khám phá những điểm đến hàng đầu trong Việt Nam</h2>
            </div>
            <Types type={type} setType={setType}/>
            <div className="mb-5">
                <Hotels type={type}/>
            </div>
        </div>
    )
}

export default HotelType
