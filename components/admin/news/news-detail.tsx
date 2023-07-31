import { Tag } from "primereact/tag";
import { Model } from "../../../interface";
import { Image } from 'primereact/image';
import HtmlRenderer from "../HtmlRenderer";
import { Chip } from "primereact/chip";
interface HotelDetailProps {

    news: Model.News | null;
}

const NewsDetail: React.FC<HotelDetailProps> = ({
    news
}) => {

    const getTypeName = (type: number) => {

        let typeName = "";
        switch (type) {
            case 1:
                typeName = "Khách sạn"
                break;
            case 2:
                typeName = "Du lịch"
                break;
            case 3:
                typeName = "Kinh nghiệm và lời khuyên"
                break;
            default:
                break;
        }

        return typeName;
    }

    if (!news)
        return null;
    else {
        return (
            <>
                <div className="card p-fluid"  >
                    <div className="justify-content-center" style={{ justifyContent: "center" }}>
                        <Image src={news?.image} alt="Image" width="250" preview />
                    </div>
                    <div>
                        <HtmlRenderer htmlString={news.summary} />
                    </div>
                    <br />


                    <div>
                        <Tag style={{ background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' }}>
                            <div className="flex align-items-center gap-2">
                                <span className="text-base">{getTypeName(news?.type)}</span>
                            </div>
                        </Tag>

                    </div>

                    <div className="flex">
                        <div style={{ marginRight: '1rem' }}>
                            <i className="pi pi-eye" ></i>
                            <span> {news.views} lượt xem </span>
                        </div>

                        <div>
                            <i className="pi pi-calendar"></i>
                            <span> {news.created_at} </span>
                        </div>

                    </div>

                    <h1>{news.title}</h1>
                    <div>
                        <HtmlRenderer htmlString={news.content} />
                    </div>
                </div >
                <Chip label={news?.user_name} image={news?.user_avatar} style={{ fontWeight: 'bold' }} />

            </>
        )
    }
}

export default NewsDetail;
