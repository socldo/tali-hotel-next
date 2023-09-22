import { Rating } from "primereact/rating";
import { Model } from "../../../interface";
import { Chip } from 'primereact/chip';
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import CustomErrorPage from "../custom-error";

interface Props {

    currentReview: Model.ReviewDetail | null;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;

}
const ReviewHotel: React.FC<Props> = ({
    currentReview,
    setVisible,
    onSave
}) => {
    const [value, setValue] = useState<string>('');

    const avatar = getCookie('avatar');
    const name = getCookie('name');
    const token = getCookie('jwt_token')?.toString();
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);


    const roleTemplate = (roleId: number, roleName: string) => {

        let severity: "success" | "danger" | "info" | "warning" = "success";

        switch (roleId) {
            case 1:
                severity = 'success'
                break;
            case 2:
                severity = 'warning'
                break;
            case 3:
                severity = 'info'
                break;
            case 4:
                severity = 'danger'
                break;
            default:
                break;
        }
        return (
            <div>
                <Tag severity={severity} value={roleName} rounded></Tag>
            </div>
        )
    };

    const handleSave = async () => {

        let data = await handleCreate();

        if (data?.status == 200) {
            setVisible(false);
            onSave();
        } else {

            setVisibleError(true);


        }
    }
    const handleCreate = async () => {

        try {

            const response = await fetch(`/api/reviews/create`, {
                method: "POST",
                body: JSON.stringify({
                    parent_review_id: currentReview?.id,
                    hotel_id: currentReview?.hotel_id,
                    content: value,
                    score_rate: 0

                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log(data);

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

            return data;
        } catch (error) {
            console.error('Error fetching:', error);

        }
    };


    return (
        <>
            <div className="card p-fluid" >
                <div className="flex" style={{ alignItems: "center", display: "flex" }}>
                    <div >
                        <Chip label={currentReview?.user_name} image={currentReview?.user_avatar} style={{ fontWeight: 'bold' }} />
                    </div>
                    <div >
                        {roleTemplate(currentReview?.user_role_id ?? 0, currentReview?.user_role_name ?? "")}
                    </div>
                </div>

                <div className="card p-fluid" style={{ marginTop: '0.2rem' }}>
                    <div className="flex" style={{ alignItems: "center" }} >

                        <div className=" justify-content-center" style={{ marginLeft: '0.2rem' }}>
                            <Rating value={currentReview?.score_rate} readOnly cancel={false} />
                        </div>

                    </div>
                    <br />

                    {currentReview?.content}
                    <div>
                        <Chip label={currentReview?.created_at} />
                    </div>
                </div>

                <hr className="my-8"></hr>
                {currentReview?.comments ? (


                    currentReview.comments.map((comment) => (
                        <div className="card p-fluid" style={{ marginLeft: '3rem' }} key={comment.id}>
                            <div className="flex" style={{ alignItems: "center", margin: '0.2rem' }}>
                                <div>
                                    <Chip label={comment.user_name} image={comment.user_avatar} style={{ fontWeight: 'bold' }} />
                                </div>

                                <div >
                                    {roleTemplate(comment?.user_role_id ?? 0, comment?.user_role_name ?? "")}
                                </div>
                            </div>

                            <div className="card p-fluid" style={{ marginTop: '0.2rem' }}>
                                {comment.content}
                                <div >
                                    <Chip label={comment?.created_at} />
                                </div>
                            </div>
                            <hr className="my-8"></hr>

                        </div>

                    ))

                ) : null}


            </div>

            <div>
                <div className="p-fluid" style={{ display: 'grid' }}>
                    {typeof name === 'string' && typeof avatar === 'string' ? (
                        <Chip label={name} image={avatar} style={{ fontWeight: 'bold', justifySelf: 'end' }} />
                    ) : null}

                    <span className="p-float-label">
                        <InputTextarea id="description" value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} />
                        <label htmlFor="description">Bình luận</label>
                    </span>

                </div>
                <div>
                    {/* <div className="mt-8" onClick={() => handleSave()} >
                                        <Button
                                            text="Đánh giá"
                                            textColor="text-white"
                                            bgColor="bg-primary"
                                        />
                                    </div> */}
                    <div className='button-save-cancel' style={{ textAlign: 'right' }}>
                        <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                        <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisible(false); }} />
                    </div>
                </div>
            </div>

            {responseAPI?.status != 200 ?
                <>

                    <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Lỗi rồi">

                        <CustomErrorPage props={responseAPI} />

                    </Dialog>
                </>
                : null
            }
        </>
    )

}

export default ReviewHotel;