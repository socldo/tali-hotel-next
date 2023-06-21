import Link from 'next/link'
import React from 'react'
import { IHotel, IRoom } from '../../models'
import Button from './Button'
import StarRating from './StarRating'
import { Image } from 'primereact/image';
import { MdLocationOn } from '../../utils/icons'

interface Props {
    data?: IRoom[];
    city?: string;
}

const SearchResults: React.FC<Props> = ({ data, city }) => {
    return (
        <div>
            {city && (
                <h2 className="text-2xl font-bold mb-4 capitalize">
                    {city}: {data?.length} Kết quả
                </h2>
            )}
            {data?.map((hotel) => (
                <>
                    <div className="card flex flex-col lg:flex-row gap-1 border p-5 mb-5">
                        <Image
                            className="basis-1/4 w-full h-full lg:w-1/4 object-cover"
                            width="500"
                            height="500"
                            src="https://images.unsplash.com/photo-1620814153812-38115a7f0fbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                            preview
                        />
                        <div className="basis-1/2 flex-1 flex flex-col justify-between lg:flex-row gap-1">
                            <div className="lg:mx-4">
                                <div className="flex flex-wrap gap-1">
                                    <p className="text-xl font-bold text-secondary">
                                        {hotel.name}
                                    </p>                                   
                                </div>
                                <StarRating data={hotel.average_rate} />
                                <div className="text-sm underline text-secondary flex items-center flex-wrap gap-2">
                                    <MdLocationOn />
                                    <span className="cursor-pointer capitalize">
                                        {hotel.address}
                                    </span>
                                    <span className="cursor-pointer flex-wrap">
                                        Show on map
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <p className="text-sm mt-2 flex items-center flex-wrap gap-1">{hotel.description}</p>                                
                                </div>

                            </div>
                            <div
                                className="basis-auto font-semibold flex flex-row lg:flex-col justify-between items-center lg:items-end ">
                                <div
                                    className="items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg float-right lg:mb-4"
                                >
                                    {hotel.average_rate ? hotel.average_rate : 'No score'}
                                </div>
                                <Button
                                    text="Show prices"
                                    textColor="text-white"
                                    bgColor="bg-lightPrimary"
                                />
                            </div>
                        </div>
                    </div>
                </>
            ))}
        </div>
    )
}

export default SearchResults
