import { getCookie } from "cookies-next";
import querystring from 'querystring';
import { useEffect, useRef, useState } from "react";
import { Model } from "../../../interface";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Rating } from "primereact/rating";
import { toast } from "react-toastify";
import { MenuItem } from "primereact/menuitem";
import { SpeedDial } from "primereact/speeddial";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import CustomErrorPage from "../../../components/admin/custom-error";
import ReviewDetail from "../../../components/admin/review/review-detail";

function Review() {

    const token = getCookie('jwt_token')?.toString();
    const [loading, setLoading] = useState(true);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [hotels, setHotels] = useState<Model.Hotel[]>([]);
    const [reviews, setReviews] = useState<Model.Reviews[]>([]);
    const [review, setReview] = useState<Model.ReviewDetail>();
    const [reviewFilters, setReviewFilters] = useState<Model.ReviewDetail[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [sortKeyHotel, setSortKeyHotel] = useState(null);
    const [renderCount, setRenderCount] = useState(0);
    const [sortKey, setSortKey] = useState(null);
    const buttonEl = useRef(null);
    const [visible, setVisible] = useState(false);


    const [confirmPopup, setConfirmPopup] = useState(false);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            await fetchReviews();
            await fetchHotels();
        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [renderCount]);

    useEffect(() => {
        filter()
    }, [reviews, sortKeyHotel, sortKey]);


    useEffect(() => {
        if (responseAPI?.status != 200) {
            setVisibleError(true);
        } else
            setVisibleError(false);

    }, [responseAPI]);


    const filter = () => {


        const copiedReviews: Model.ReviewDetail[] = reviews
            ?.filter(review => review.parent_review_id === 0)
            .map(review => ({
                ...review,
                comments: reviews.filter(comment => comment.parent_review_id === review.id)
            }));



        if (sortKeyHotel && sortKey) {
            setReviewFilters(copiedReviews.filter(review => review.hotel_id == sortKeyHotel && review.score_rate == sortKey));
        }
        else if (sortKeyHotel) {
            setReviewFilters(copiedReviews.filter(review => review.hotel_id == sortKeyHotel));
        }
        else if (sortKey) {
            setReviewFilters(copiedReviews.filter(review => review.score_rate == sortKey));
        }
        else {
            setReviewFilters(copiedReviews);
        }


    };




    const fetchReviews = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ parent_review_id: -1, user_id: -1, hotel_id: -1, is_deleted: 0 });
            const response = await fetch(`/api/reviews/get-list?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setReviews(data.data);
            setLoading(false);

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const fetchHotels = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ status: -1 });
            const response = await fetch(`/api/hotels/get-list?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setHotels(data.data);
            setLoading(false);

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const handleChangeStatus = async () => {

        try {

            const response = await fetch(`/api/reviews/${review?.id}/deleted`, {
                method: "POST",
                body: JSON.stringify({
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log('data:', data);

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

            if (data.status == 200) {

                setRenderCount(renderCount + 1);
            }
            return data;
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    };



    const starIcon = "\u2605";
    const sortOptions = [

        { label: 'Tất cả', value: 0 },
        { label: `1 ${starIcon}`, value: 1 },
        { label: `2 ${starIcon}`, value: 2 },
        { label: `3 ${starIcon}`, value: 3 },
        { label: `4 ${starIcon}`, value: 4 },
        { label: `5 ${starIcon}`, value: 5 }
    ];

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:items-center">

            <div>

            </div>
            <h4 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
                Đánh giá
            </h4>

            <div className="text-right">

                <Dropdown value={sortKeyHotel} options={[
                    { label: 'Tất cả', value: 0 },
                    ...(hotels?.map(hotel => ({ label: hotel.name, value: hotel.id })) || [])
                ]} optionLabel="label" placeholder="Khách sạn"
                    onChange={(e) => setSortKeyHotel(e.value)}
                    style={{ marginRight: '.5em' }} />

                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Bộ phận" onChange={(e) => setSortKey(e.value)} style={{ marginRight: '.5em' }} />


                <span className="block mt-2 md:mt-0 p-input-icon-left" style={{ marginRight: '.5em' }}>
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                        placeholder="Search..."
                    />
                </span>

            </div>
        </div >
    );
    const starBodyTemplate = (rowData: Model.ReviewDetail) => {

        return (
            <div className=" flex justify-content-center">
                <Rating value={rowData.score_rate} readOnly cancel={false} />
            </div>
        );
    };



    const actionBodyTemplate = (rowData: Model.ReviewDetail) => {



        const handleClickUpdateStatus = () => {
            setConfirmPopup(true);
        };

        const accept = async () => {

            let changeStatus = await handleChangeStatus();

            if (changeStatus?.status === 200) {
                toast.success('Cập nhật thành công');
            }
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')


        };

        const items: MenuItem[] = [

            {
                label: 'Update-Unactive',
                icon: 'pi pi-times',
                command: () => {
                    handleClickUpdateStatus();
                },

            },
            {
                label: 'Detail',
                icon: 'pi pi-comments',
                command: () => {
                    setVisible(true);
                }
            }
        ];

        return (
            <>

                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />

                <div className="flex align-items-center justify-content-center" style={{ marginRight: '3rem', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <SpeedDial onClick={() => { setReview(rowData); }} model={items} direction="left" style={{ right: '3rem' }} />
                    </div>
                </div>
            </>
        )

    }

    const showSuccess = () => {
        setRenderCount(renderCount => renderCount + 1);

        toast.success('Cập nhật thành công!');

    }
    return (
        <>

            <DataTable
                value={reviewFilters}
                scrollable scrollHeight="400px"
                loading={loading}
                className="mt-3"
                globalFilter={globalFilter}
                header={header}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                tableStyle={{ minWidth: '20rem' }}
                style={{ fontSize: '14px' }}
            >
                <Column
                    header="STT"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    style={{ flexGrow: 1, flexBasis: '100px' }}
                ></Column>
                <Column field="user_name" header="Người đánh giá" style={{ flexGrow: 1, flexBasis: '160px' }} sortable className="font-bold"></Column>

                <Column field="hotel_name" header="Khách sạn" style={{ flexGrow: 1, flexBasis: '200px' }} sortable></Column>
                <Column field="content" header="Nội dung" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column body={(reviewFilters) => starBodyTemplate(reviewFilters)} field="score_rate" sortable header="Điểm đánh giá" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column body={(reviewFilters) => actionBodyTemplate(reviewFilters)}></Column>
            </DataTable>

            <Dialog visible={visible} maximizable onHide={() => setVisible(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Đánh giá">

                <ReviewDetail setVisible={setVisible} onSave={() => showSuccess()} currentReview={review ?? null}></ReviewDetail>

            </Dialog>

            {responseAPI?.status != 200 ?
                <>

                    <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} >

                        <CustomErrorPage props={responseAPI} />

                    </Dialog>
                </>
                : null
            }
        </>
    );
}

export default Review;