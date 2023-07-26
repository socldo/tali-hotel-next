import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { INew } from "../../models/INew";
import { Image } from 'primereact/image';
import { Tag } from "primereact/tag";
import { Avatar } from 'primereact/avatar';
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";

const BlogDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [item, setNews] = useState<INew>();
    const [newsTop, setNewsTop] = useState([]);
    
    const getDetailNews = async () => {
        
        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        const url = `/api/news/${id}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        setNews(data.data)
        
        return data.data;

    }

    const getListNewsTop = async () => {
        
        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
        const url = `/api/news/get-list?sort=1`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();
        setNewsTop(data.data)
        
        return data.data;

    }


    useEffect(() => {
        getDetailNews()
        getListNewsTop()
    }, [])
    
    const handleDetail = (id: any) => {
        router.push(`/blog/${id}`)
    };

    const getSeverity = (news: any) => {
        switch (news?.type) {
        case 1:
            return 'Khách sạn';

        case 2:
            return 'Du lịch';

        case 3:
            return 'Kinh nghiệm và lời khuyên';

        default:
            return null;
        }
    };

    return (
        <div className="mr-11 ml-11 mt-16">
            <div className="mr-80 ml-80 rounded-lg">
                <div className="grid grid-cols-3 gap-4 rounded-lg">
                    <div className="col-span-2 flex flex-col py-2 border-round rounded-lg">
                        <div key={item?.id} className="boder-1 mt-4 mb-8 border rounded-lg">
                            <Image src={item?.image} alt="Image" width="800" preview />
                            <div className="ml-8 mt-4 mr-8 mb-8">
                                <Tag severity={'info'}>{getSeverity(item)}</Tag>
                                <div className="flex flex-row mt-4 text-sm text-slate-500 mb-4">
                                    <p> <span className="pi pi-eye"></span> {item?.views}</p>
                                    <p> <span className="ml-4 pi pi-comments"></span> {item?.views}</p>
                                    <p> <span className="ml-4 pi pi-calendar-times"></span> {item?.created_at.toLocaleString()}</p>
                                </div>
                                <h2 className="italic text-2xl font-semibold mt-4">{item?.title}</h2>

                                <h2 className="mt-4 text-base text-slate-600">{item?.summary}</h2>
                                <h2 className="mt-4 text-base text-slate-600">{item?.content}</h2>
                                <div className="flex justify-between mt-4 items-center">
                                    <div className="flex flex-row grad-4 items-center">
                                        <Avatar image={item?.user_avatar} className="mr-2" size="large" shape="circle" />
                                        <p className="font-semibold ">{item?.user_name}</p>
                                    </div>
                                        
                                    {/* <Link className="items-center text-yellow-600 text-sm font-semibold hover:text-yellow-700" href={""}>
                                        <p className=""><span className="mr-2 pi pi-arrow-right"></span>Read more</p>
                                    </Link> */}
                                </div>
                            </div>
                               
                        </div>

                    </div>
                    <div className="grid grid-cols-1 flex content-start mt-6 rounded-lg">
                        <div className="py-2 border rounded-lg">
                            <h1 className="ml-8 mt-8 text-lg font-semibold text-neutral-600"><span className="pi pi-info"></span> Giới thiệu về tôi</h1>
                            <div className="text-center mt-8 ml-8 mr-8 justify-items-center">
                                <Avatar label="P" size="xlarge" shape="circle" image="https://firebasestorage.googleapis.com/v0/b/tali-hotel.appspot.com/o/branches%2F80186458-bff7-4a33-86c4-9c3e483cc7fe.jpg?alt=media&token=241ac97b-5acd-47dd-91ee-b270f1c17a28"/>
                                <h1 className="mt-6 font-semibold">Bùi Nguyễn Minh Tài</h1>
                                <p className="mt-6 text-stone-600 text-sm"> Hãy để đội ngũ chúng tôi chăm sóc và phục vụ bạn với tận tâm, để bạn có một kỳ nghỉ tuyệt vời và thoải mái nhất. </p>
                                <p className="space-x-4 mt-8 mb-8">
                                    <i className="pi pi-facebook"></i>
                                    <i className="pi pi-twitter"></i>
                                    <i className="pi pi-discord"></i>
                                    <i className="pi pi-linkedin"></i>
                                    <i className="pi pi-youtube"></i>
                                </p>
                            </div>
                        </div>
                        <div className="py-2 border rounded-lg mt-4">
                            <h1 className="ml-8 mt-8 text-lg font-semibold text-neutral-600">Tìm kiếm</h1>
                            <div className="text-center mt-8 ml-8 mr-8 justify-items-center">
                                <span className="p-input-icon-left border-round mb-16">
                                    <i className="pi pi-search" />
                                    <InputText className="border-lg" placeholder="Tìm kiếm" />
                                </span>
                            </div>
                        </div>
                        <div className="py-2 border rounded-lg mt-4">
                            <h1 className="ml-8 mt-8 text-lg font-semibold text-neutral-600">Blog phổ biến</h1>
                            <div className=" mt-8 ml-8 mr-8 ">
                                <ul className="mx-auto container flex flex-col gap-x-2 text-black">
                                    {newsTop.map((item: INew) =>
                                        <li key={item.id} onClick={() => handleDetail(item.id)}
                                            className="mb-8 rounded-3xl hover:bg-gray-500 hover:bg-opacity-25 whitespace-no-wrap flex flex-row items-center">
                                            <Avatar image={item.user_avatar} className="mr-2" size="large" shape="circle" />
                                            <div>
                                                <p className="font-semibold text-sm">{item.title}</p>
                                                <p className="text-sm"> <span className="ml-4 pi pi-calendar-times "></span> {item.created_at.toLocaleString()}</p>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
