import React, { useEffect, useState } from 'react'
import Button from '../core/Button'
import { Image } from 'primereact/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay } from 'swiper'
import getFlagEmoji from '../../utils/getFLagEMoji'
import Link from 'next/link'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router';



const Offers = () => {
    const router = useRouter()
    const [data, setData] = useState([]);

    let token = getCookie('jwt_token')?.toString();

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
        console.log(data.data);

        return data.data
    }

    useEffect(() => {
        getBranches()
            .then(result => {
                setData(result);
            })
    }, []);

    const handleClick = () => {
        router.push('/blog')
    } 


    const offers = [
        {
            title: 'Giảm 15% cho kì nghỉ lễ',
            description: 'Kiểm tra thêm một điểm đến trong danh sách mong muốn của bạn',
            button: 'Khám phá',
            image: '1.avif'
        },
        {
            title: 'Rời xa thành thị chật chội',
            description: 'Tận hưởng 1 tháng tự dơ theo cách của bạn',
            button: 'Khám phá',
            image: '2.avif'
        },
        {
            title: 'Dễ dàng lên chuyến đi',
            description: 'Chọn một bầu không khí và khám phá những điểm đến hàng đầu.',
            button: 'Khám phá',
            image: '3.avif'
        }
    ]

    return (
        <div className="mt-48 sm:mt-32 lg:mt-28 mb-20 w-full relative">
            <div className="mb-5">
                <h1 className="font-bold text-2xl text-black">Ưu đãi</h1>
                <h2 className="text-primary font-light text-xl">Khuyến mãi, giảm giá và các chương trình hấp dẫn </h2>
            </div>

            <div className="select-none mb-5">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1.5}
                    loop={true}
                    autoplay={true}
                    modules={[Autoplay]}
                >
                    <div className="mt-10">
                        <h1 className="font-bold text-2xl text-black">Điểm đến đang thịnh hành</h1>
                        <h2 className="text-primary font-light text-xl">Du khách tìm kiếm về Việt Nam cũng đặt chỗ ở những nơi này</h2>
                    </div>
                    {offers.map(offer =>
                        <SwiperSlide key={offer.title}>
                            <div className="relative w-full rounded-2xl overflow-hidden">
                                <Image className="absolute w-full h-full -z-10 object-cover"
                                    src={`/assets/images/offer/${offer.image}`}
                                    alt={offer.title}
                                    width="1000"
                                    height="3000"
                                    loading={'lazy'}
                                />
                                <div className="p-2.5 sm:px-5 sm:py-10 text-white">
                                    <h2 className="font-bold mb-2 text-2xl sm:text-3xl h-24 sm:h-16 lg:h-max">{offer.title}</h2>
                                    <h2 className="mb-5">{offer.description}</h2>
                                    <div onClick={handleClick}>
                                        <Button text={offer.button} textColor={'text-white'} width={'w-40'}
                                            bgColor={'bg-lightPrimary'} />
                                    </div>
                                    
                                </div>
                            </div>
                        </SwiperSlide>
                    )}

                </Swiper>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Fix key index */}
                {data != null ? data.map((location: any, index: any) =>
                    <Link href={`/search/${location.id}`} key={index}>
                        <div
                            className={`relative block overflow-hidden rounded-xl `}
                        >
                            <Image className="absolute w-full h-full object-cover"
                                src={location.images}
                                alt={location.name} />
                            <div className="relative p-8 pt-40 text-white hover:bg-black hover:bg-opacity-40">
                                <h3 className="text-2xl font-bold">{location.name}</h3>
                                <h5 className="text-xl">{location.address}</h5>
                            </div>
                        </div>
                    </Link>
                ) : <>No data</>}
            </div>

        </div>
    )
}


export default Offers;
