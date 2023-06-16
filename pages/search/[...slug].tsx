import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {SearchVertical} from '../../components/core'
import FilterHotels from '../../components/core/FilterHotels'
import SearchResults from '../../components/core/SearchResults'
import {Layout, Loader} from '../../components/layout'
import {useGetHotelsQuery} from '../../services/hotelApi'
import { IRoom } from '../../models'
interface Props {
    room?: IRoom[];
    setHotelsType: any;
}
const SearchPage : React.FC<Props> =  ({room}) => {
    const router = useRouter()
    const queryUrl = router?.query

    const branchSlug = queryUrl?.slug ? queryUrl?.slug[0] : ''
    const minSlug = queryUrl?.min
    const maxSlug = queryUrl?.max

    const [branchId, setBranchId] = useState(branchSlug)

    const [branchName, setBranchName] = useState();
    useEffect(() => {
        setBranchId(branchSlug)
    }, [branchSlug])
    // console.log(branchId);
    
    const handleCreateUpdate = async () => {
        let token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMzcyMjAyODA3IiwiaWF0IjoxNjg2ODMyMzc4LCJleHAiOjE2ODY5MTg3Nzh9.NnXteOvj9agvBgb3hs3UYvgDuVqH2UVKonMX5xti76DC1f4MhNUQ0_D5c6vL_VlWyagWVKfhP5x-KS3sr0YvCg'
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        let url = `/api/branches/${branchId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token
            }),
        });
        const data = await response.json();
        // console.log( data);
        setBranchName(data.data.name)
        return data;
    }
    useEffect(() => {
        handleCreateUpdate();
    }, [handleCreateUpdate()]); // Passing an empty array as the second argument to useEffect will ensure that the effect runs only once, when the component mounts.
    
    // const {data: hotels, isLoading} = useGetHotelsQuery({
    //     city: branchId,
    //     limit: 20,
    //     min: minSlug ? +minSlug : undefined,
    //     max: maxSlug ? +maxSlug : undefined
    // })
    const [hotelsType, setHotelsType] = useState(room || undefined)

    // if (isLoading) {
    //     return (
    //         <div className="w-screen mt-20 flex items-center justify-center">
    //             <Loader/>
    //         </div>
    //     )
    // }
    // console.log(city);
    
    return (
        <Layout
            metadata={{
                title: `Search: ${branchName} - Booking`,
                description: `Booking`
            }}
        >
            <div className="mx-auto container px-4 lg:px-6 py-5 ">
                <div className="w-full lg:flex gap-5">
                    <div className="w-full lg:w-1/4 h-min">
                        {/* <SearchVertical/> */}
                        <FilterHotels room={room} setHotelsType={setHotelsType}/>
                    </div>
                    <div className="flex-1">
                        <SearchResults data={hotelsType} city={branchName}/>
                    </div>
                </div>

            </div>
        </Layout>

    )
}

export default SearchPage
