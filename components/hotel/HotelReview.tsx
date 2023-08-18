import React, { useState } from "react";
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
import { useAppSelector } from "../../store/hooks";
import Link from "next/link";
import { getCookie } from "cookies-next";

const HotelReview = ({ reviews, id, setShowModal }: any) => {
    const [postReview] = usePostReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();
    const [updateReview] = useUpdateReviewMutation();

    const [reviewInput, setReviewInput] = useState("");
    const [score, setScore] = useState(10);
    const token = getCookie('jwt_token');
    const user_id = getCookie('id');
    const email = getCookie('email');
    const phone = getCookie('phone');
    const name = getCookie('name');
    const role = getCookie('role');
    const avatar = getCookie('avatar');

    const handleChangeReview = (e: React.ChangeEvent<any>) => {
        setReviewInput(e.target.value);
    };

    const handleChangeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScore(+e.target.value);
    };

    const handleReview = async () => {
        if (!reviewInput || !score) {
            toast.error("Vui lòng điền vào ô trống");
        } else if (score < 0 || score > 10) {
            toast.error("Điểm 0-10");
        } else {
            await postReview({ id, review: reviewInput, score });
            toast.success("Đánh giá thành công");
            setReviewInput("");
        }
    };
    const handleDeleteReview = async (id: string) => {
        if (window.confirm("Bạn muốn xoá đúng không?")) {
            try {
                await deleteReview(id);
                toast.success("Xoá review thành công!");
            } catch (err) {
                toast.error("Có gì đó sai sai!");
            }
        }
    };
    const handleUpdateReview = async (id: string) => {
        try {
            await updateReview({ id, review: reviewInput });
            toast.success("Chỉnh sửa thành công");
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
                                                <div className="flex items-center">
                                                    <div>
                                                        <Image
                                                            className="w-full object-cover rounded-full"
                                                            width={32}
                                                            height={32}
                                                            src={review?.users?.avatar}
                                                            alt={review?.users?.avatar}
                                                        />
                                                    </div>
                                                    <p className="ml-2 text-black text-lg leading-relaxed flex-1 w-auto font-semibold capitalize">
                                                        {review?.users?.name || review?.users?.username}
                                                    </p>
                                                </div>
                                                <div className="ml-6">
                                                    <p className="text-gray-500 text-xs leading-relaxed flex-1 w-64">
                                                        Đã đánh giá: {moment(review.updatedAt).format("LLL")}
                                                    </p>
                                                    <div className="flex">
                                                        <textarea
                                                            defaultValue={review.content}
                                                            disabled={
                                                                review.users.id === user_id ? false : true
                                                            }
                                                            className="text-black text-xl leading-relaxed flex-1 w-64 mr-2 border-none rounded w-full md:py-1 bg-inherit p-2 h-12 resize-none hover:resize"
                                                            onChange={handleChangeReview}
                                                        />
                                                        {review.users.id === user_id && (
                                                            <>
                                                                {reviewInput && <div onClick={() => handleUpdateReview(review._id)} className="cursor-pointer items-center inline-flex cursor-pointer opacity-0 group-hover:opacity-100 text-2xl absolute right-1/4 mt-2">
                                                                    <CiEdit />
                                                                </div>}
                                                                <div
                                                                    onClick={() => handleDeleteReview(review._id)}
                                                                    className="cursor-pointer items-center inline-flex cursor-pointer opacity-0 group-hover:opacity-100 text-2xl absolute left-3/4 mt-2 ml-2"
                                                                >
                                                                    <AiOutlineClose />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="items-center p-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg float-right lg:mb-4 justify-center flex">
                                                        {review.score_rate.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="my-6"></hr>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                <h3 className="text-3xl font-semibold">Không có đánh giá</h3>
                            </div>
                        )}
                        {token ? (
                            <>
                                <div className="relative p-6 flex-auto">
                                    <span className="text-black">Viết đánh giá</span>
                                    <input
                                        value={reviewInput}
                                        className="form-input block rounded my-4 w-full w-128"
                                        placeholder="Khách sạn đẹp quá!"
                                        onChange={handleChangeReview}
                                    />
                                    <span className="text-black">Điểm</span>
                                    <input
                                        value={score}
                                        type="number"
                                        className="form-input block rounded my-4"
                                        placeholder="9.5"
                                        onChange={handleChangeScore}
                                    />
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
                            <div>
                                <h3 className="font-semibold text-2xl mb-4 text-black text-center">
                                    Vui lòng đăng nhập để nhập giá
                                </h3>
                                <Link href="/auth" className="flex text-center justify-center">
                                    <Button
                                        text="Login"
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
