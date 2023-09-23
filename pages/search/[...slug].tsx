import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import FilterHotels from '../../components/core/FilterHotels'
import SearchResults from '../../components/core/SearchResults'
import { Layout } from '../../components/layout'
import { IRoom } from '../../models'
import { getCookie } from 'cookies-next'
interface Props {
    room?: IRoom[];
    setHotelsType: any;
}
const SearchPage: React.FC<Props> = ({ room }) => {
    const router = useRouter()
    const queryUrl = router?.query


    const branchSlug = queryUrl?.slug ? queryUrl?.slug[0] : ''

    const [branchId, setBranchId] = useState(branchSlug)

    const [branchName, setBranchName] = useState();
    useEffect(() => {
        setBranchId(branchSlug)
    }, [])
    useEffect(() => {
        handleGetDetailBranch();
    }, []);

    const handleGetDetailBranch = async () => {
        let token = getCookie('jwt_token')?.toString();
        let url = `/api/branches/${branchId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        setBranchName(data?.data?.name)

        return data;
    }


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
                        <FilterHotels room={room} setHotelsType={setHotelsType} branchIdBf={branchSlug} branchNameBf={branchName == undefined ? '' : branchName} />
                    </div>
                    <div className="flex-1">
                        <SearchResults data={hotelsType} city={branchName} />
                    </div>
                </div>

            </div>
        </Layout>

    )
}

export default SearchPage
