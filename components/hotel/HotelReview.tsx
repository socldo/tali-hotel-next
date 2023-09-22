import React, { useEffect, useState } from "react";
import {
    usePostReviewMutation,
    useDeleteReviewMutation,
    useUpdateReviewMutation,
} from "../../services/hotelApi";
import moment from "moment";
import { Button } from "../../components/core";
import Image from "next/image";
import { AiOutlineClose, CiEdit } from "../../utils/icons";
import { toast } from "react-toastify";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { Rating, RatingChangeEvent } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import ReviewHotel from "../admin/review/review-hotel";
import { Model } from "../../interface";

const HotelReview = ({ reviews, id, setShowModal }: any) => {
    const [value, setValue] = useState<number | null>(null);
    const token = getCookie('jwt_token')?.toString();
    const avatar = getCookie('avatar');
    const name = getCookie('name');
    const [visible, setVisible] = useState(false);

    const [reviewDetail, setReviewDetail] = useState<Model.ReviewDetail>();


    const [valueText, setValueText] = useState<string>('');


    const [deleteReview] = useDeleteReviewMutation();
    const [updateReview] = useUpdateReviewMutation();

    const [reviewInput, setReviewInput] = useState("");
    const user_id = getCookie('id');

    useEffect(() => {
        setReviewInput(valueText)

    }, [valueText]);



    const handleChangeReview = (e: React.ChangeEvent<any>) => {
        setReviewInput(e.target.value);
    };

    const handleReview = async () => {
        if (!reviewInput) {

            toast.error("Vui lòng điền nhập đánh giá");
        }
        else if (!value) {

            toast.error("Vui lòng chọn điểm đánh giá");

        }
        else {

            // const response = await postReviewMutation({ id, review: reviewInput, score_rate: score });
            let response = await handleCreate()

            if (response.status != 200) {
                toast.error("Có lỗi xảy ra khi đánh giá");
            } else {
                toast.success("Đánh giá thành công");
                setShowModal(false)
                setReviewInput("");

            }
            setValueText("")
            setReviewInput("");
        }
    };

    const handleCreate = async () => {

        try {
            let score = !value ? 1 : value;

            const response = await fetch(`/api/reviews/create`, {
                method: "POST",
                body: JSON.stringify({
                    parent_review_id: 0,
                    hotel_id: id,
                    content: reviewInput,
                    score_rate: score

                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log(data);

            return data;
        } catch (error) {
            console.error('Error fetching:', error);

        }
    };


    const fetchDeleteReview = async (reviewId: string) => {

        try {
            console.log(reviewId);

            const response = await fetch(`/api/reviews/${reviewId}/deleted`, {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log(data);


            return data;
        } catch (error) {
            console.error('Error fetching:', error);

        }
    };


    const handleDeleteReview = async (review: any) => {

        if (window.confirm("Bạn muốn xoá đánh giá này đúng không?")) {
            try {
                // await deleteReview(id);

                await fetchDeleteReview(review.id);
                toast.success("Xoá review thành công!");
                setShowModal(false)
            } catch (err) {
                toast.error("Có gì đó sai sai!");
            }
        }
    };
    const handleUpdateReview = async (id: string) => {
        try {
            await updateReview({ id, review: reviewInput });
            toast.success("Chỉnh sửa thành công");
            setShowModal(false)
            setReviewInput("");
        } catch (err) {
            toast.error("Có gì đó sai sai!");
        }
    };
    return (
        <>
            <div className="items-right flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div
                    className="relative w-auto h-auto max-w-3xl ml-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="border-0 shadow-lg relative flex flex-col w-full h-auto min-h-full bg-white outline-none focus:outline-none">
                        {reviews?.length > 0 ? (
                            <div>
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="font-bold text-2xl mb-4 text-black contents">
                                        Đánh giá khách hàng
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            <AiOutlineClose />
                                        </span>
                                    </button>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    {reviews?.map((review: any, index: any) => (
                                        <div key={index} className="group">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <div className="flex items-center">
                                                        <div>
                                                            <Avatar image={review?.user_avatar} size="large" shape="circle" />

                                                        </div>
                                                        <p className="ml-2 text-black text-lg leading-relaxed flex-1 w-auto font-semibold capitalize">
                                                            {review?.users?.name || review?.users?.username}
                                                        </p>
                                                    </div>
                                                    <Rating value={review.score_rate} readOnly cancel={false} />
                                                </div>
                                                <div className="ml-1">
                                                    <p className="text-gray-500 text-xs leading-relaxed flex-1 w-64">
                                                        Đã đánh giá: {review?.updated_at}
                                                    </p>
                                                    <div className="flex">

                                                        <div style={{ color: "black" }}>{review.content}</div>

                                                    </div>
                                                </div>

                                                <div>
                                                    <div onClick={() => { setReviewDetail(review), setVisible(!visible) }
                                                    }>
                                                        {review?.comments?.length} câu trả lời
                                                    </div>
                                                    <Dialog visible={visible} maximizable onHide={() => setVisible(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Đánh giá">

                                                        <ReviewHotel setVisible={setVisible} onSave={() => console.log(1)
                                                        } currentReview={reviewDetail ?? null}></ReviewHotel>

                                                    </Dialog>
                                                </div>
                                            </div>
                                            <hr className="my-8"></hr>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t" style={{ "margin": '1rem', 'justifyContent': 'center' }}>
                                <h3 className="text-3xl font-semibold">Không có đánh giá</h3>
                            </div>
                        )}
                        {token ? (
                            <>
                                <div className="relative p-6 flex-auto">
                                    <div className="p-fluid" style={{ display: 'grid' }}>
                                        {typeof name === 'string' && typeof avatar === 'string' ? (
                                            <Chip label={name} image={avatar} style={{ fontWeight: 'bold', justifySelf: 'end' }} />
                                        ) : null}

                                        <span className="p-float-label">
                                            <InputTextarea id="description" value={valueText} onChange={(e) => setValueText(e.target.value)} rows={5} cols={30} />
                                            <label htmlFor="description">Nội dung</label>
                                        </span>

                                    </div>

                                    <div className="card flex justify-content-center mt-2">
                                        <Rating value={value !== null ? value : undefined} onChange={(e: RatingChangeEvent) => setValue(e.value!)} cancel={false} />
                                    </div>

                                    <div className="mt-8" onClick={handleReview}>
                                        <Button
                                            text="Đánh giá"
                                            textColor="text-white"
                                            bgColor="bg-primary"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ "margin": '1rem' }}>
                                <h3 className="font-semibold text-2xl mb-4 text-black text-center">
                                    Vui lòng đăng nhập để nhập giá
                                </h3>
                                <Link href="/auth" className="flex text-center justify-center">
                                    <Button
                                        text="Đăng nhập"
                                        textColor="text-white"
                                        bgColor="bg-primary"
                                    />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default HotelReview;
