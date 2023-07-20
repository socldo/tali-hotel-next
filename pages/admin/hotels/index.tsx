import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import querystring from 'querystring';
import { getCookie } from "cookies-next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { ConfirmPopup } from "primereact/confirmpopup";
import { toast } from 'react-toastify'
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import HotelDetail from "../../../components/admin/hotel/hotel-detail";
import CustomErrorPage from "../../../components/admin/custom-error";
import HotelCreate from "../../../components/admin/hotel/hotel-create";
import { Model } from '../../../interface/index'
import HotelUpdateImages from "../../../components/admin/hotel/hotel-update-images";
import { MenuItem } from "primereact/menuitem";
import { SpeedDial } from "primereact/speeddial";

function Hotel() {

    const [hotels, setHotels] = useState<Model.Hotel[]>([]);
    const [branches, setBranches] = useState<Model.Branch[]>([]);

    const [hotel, setHotel] = useState<Model.Hotel>();

    const [hotelFilters, setHotelFilters] = useState<Model.Hotel[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [confirmPopup, setConfirmPopup] = useState(false);

    const [activeIndex, setActiveIndex] = useState(0);
    const buttonEl = useRef(null);

    const [sortKey, setSortKey] = useState(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
    const [visibleImages, setVisibleImages] = useState<boolean>(false);

    const [visible, setVisible] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);
    const [renderCount, setRenderCount] = useState(0);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });

    const token = getCookie('jwt_token')?.toString();


    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            await fetchHotels();
            await fetchBranches();
        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [renderCount]);

    useEffect(() => {
        filter()
    }, [sortKey, activeIndex, hotels]);


    useEffect(() => {
        if (responseAPI?.status != 200) {
            setVisibleError(true);
        } else
            setVisibleError(false);

    }, [responseAPI]);


    const filter = () => {
        if (activeIndex == 0) {
            if (!sortKey) {
                setHotelFilters(hotels?.filter((hotel: { status: boolean; }) => hotel.status));
            }
            else {
                setHotelFilters(hotels?.filter(hotel => hotel.branch_id == sortKey && hotel.status));

            }
        }
        else {
            if (!sortKey) {
                setHotelFilters(hotels?.filter((hotel: { status: boolean; }) => !hotel.status));
            }
            else {
                setHotelFilters(hotels?.filter(hotel => hotel.branch_id == sortKey && !hotel.status));

            }
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


    const fetchBranches = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ status: -1 });
            const response = await fetch(`/api/branches?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setBranches(data.data);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching:', error);
            setLoading(false);
        }
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:items-center">

            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Đang hoạt động" rightIcon="pi pi-check-circle ml-2" >
                </TabPanel>
                <TabPanel header="Tạm ngưng" rightIcon="pi pi-ban ml-2">
                </TabPanel>
            </TabView>


            <h4 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>
                Khách Sạn
            </h4>

            <div className="text-right">
                <Dropdown value={sortKey} options={[
                    { label: 'Tất cả', value: 0 },
                    ...(branches?.map(branch => ({ label: branch.name, value: branch.id })) || [])
                ]} optionLabel="label" placeholder="Khu vực"
                    onChange={(e) => setSortKey(e.value)}
                    style={{ marginRight: '.5em' }} />

                <span className="block mt-2 md:mt-0 p-input-icon-left" style={{ marginRight: '.5em' }}>
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                        placeholder="Search..."
                    />
                </span>
                <Button
                    label="Thêm Mới"
                    icon="pi pi-plus"
                    style={{ marginRight: '.5em' }}

                    onClick={() => {
                        setVisibleCreate(true);
                        setHotel(undefined);
                    }}
                />
            </div>
        </div >
    );

    const handleChangeStatus = async () => {

        try {

            const response = await fetch(`/api/hotels/${hotel?.id}/change-status`, {
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
            console.error('Error fetching:', error);
        }
    };

    const actionBodyTemplate = (rowData: Model.Hotel) => {

        const accept = async () => {

            let changeStatus = await handleChangeStatus();

            if (changeStatus?.status === 200) {
                toast.success('Cập nhật thành công');
            }
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')


        };
        return (
            <>
                <div>
                    <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                        message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                        rejectLabel="Không" />


                    {rowData.status
                        ?
                        <Button icon="pi pi-times" onClick={() => { setConfirmPopup(true); setHotel(rowData); }} rounded outlined severity="danger" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />
                        :
                        <Button icon="pi pi-check" onClick={() => { setConfirmPopup(true); setHotel(rowData); }} rounded outlined severity="success" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />
                    }
                    <Button icon="pi pi-eye" onClick={() => { setVisible(true); setHotel(rowData) }} outlined rounded severity="info" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />
                    <Button icon="pi pi-pencil" onClick={() => { setVisibleCreate(true); setHotel(rowData) }} rounded outlined severity="secondary" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />
                    <Button icon="pi pi-images" onClick={() => { setVisibleImages(true); setHotel(rowData) }} rounded outlined severity="help" aria-label="Bookmark" size="small" style={{ marginLeft: '0.2rem' }} />

                </div>

            </>
        );


    };


    const actionBodyTemplate2 = (rowData: Model.Hotel) => {

        const handleClickDetail = () => {
            setVisible(true);
        };
        const handleClickUpdate = () => {
            setVisibleCreate(true);
        };
        const handleClickUpdateStatus = () => {
            setConfirmPopup(true);
        };
        const handleClickUpdateImages = () => {
            setVisibleImages(true);
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
                label: 'Detail',
                icon: 'pi pi-eye',
                command: () => {
                    handleClickDetail()
                }
            },
            {
                label: 'Update',
                icon: 'pi pi-pencil',
                command: () => {
                    handleClickUpdate();
                }
            },
            {
                label: 'Update-Image',
                icon: 'pi pi-images',
                command: () => {
                    handleClickUpdateImages();
                }
            },
            !rowData.status ?
                {
                    label: 'Update-Active',
                    icon: 'pi pi-times',
                    command: () => {
                        handleClickUpdateStatus();

                    }
                } :
                {
                    label: 'Update-Unactive',
                    icon: 'pi pi-check',
                    command: () => {
                        handleClickUpdateStatus();
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
                        <SpeedDial onClick={() => { setHotel(rowData); }} model={items} direction="left" style={{ right: '3rem' }} />
                    </div>
                </div>
            </>
        )

    }

    const showSuccess = () => {
        setRenderCount(renderCount => renderCount + 1);
        if (hotel) {

            toast.success('Cập nhật thành công!');

        } else {
            toast.success('Tạo mới thành công!');
        }

    };


    const handlePropChange = () => {
        toast.success('Cập nhật thành công!');

        setRenderCount(prevCount => prevCount + 1);
    };

    return (<>

        <DataTable
            value={hotelFilters}
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
            <Column field="name" header="Tên" style={{ flexGrow: 1, flexBasis: '160px' }} sortable className="font-bold"></Column>

            <Column field="phone" header="Số điện thoại" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
            <Column field="email" header="Email" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
            <Column field="address" header="Địa chỉ" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
            <Column field="short_description" header="Mô tả" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
            <Column body={(hotel) => actionBodyTemplate2(hotel)}></Column>
        </DataTable>

        <Dialog header="Chi tiết" visible={visible} onHide={() => setVisible(false)}
            style={{ width: '60vw' }} maximizable breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <p className="m-0">
                <HotelDetail hotel={hotel ?? null} />

            </p>
        </Dialog>

        <Dialog visible={visibleCreate} maximizable onHide={() => setVisibleCreate(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header={hotel ? 'Cập nhật' : 'Tạo mới'}>

            <HotelCreate setVisibleCreate={setVisibleCreate} currentHotel={hotel ?? null} onSave={() => showSuccess()} branches={branches?.filter(branch => branch?.status)}></HotelCreate>

        </Dialog>


        <Dialog visible={visibleImages} maximizable onHide={() => setVisibleImages(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header='Hình ảnh'>

            <HotelUpdateImages propChange={handlePropChange} setVisibleImages={setVisibleImages} hotel={hotel ?? null} />

        </Dialog>

        {responseAPI?.status != 200 ?
            <>

                <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} >

                    <CustomErrorPage props={responseAPI} />

                </Dialog>
            </>
            : null
        }

    </>);
}

export default Hotel;