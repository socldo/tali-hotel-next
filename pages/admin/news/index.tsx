import { getCookie } from 'cookies-next';
import querystring from 'querystring';
import { useEffect, useRef, useState } from 'react';
import { Model } from '../../../interface';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { SpeedDial } from 'primereact/speeddial';
import { MenuItem } from 'primereact/menuitem';
import { toast } from 'react-toastify'

function News() {

    const [news, setReviews] = useState<Model.News[]>([]);
    const [one, setOne] = useState<Model.News>();
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [newsFilter, setNewsFilter] = useState<Model.News[]>([]);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const buttonEl = useRef(null);

    const [renderCount, setRenderCount] = useState(0);

    const token = getCookie('jwt_token')?.toString();


    const sortOptions = [
        { label: 'Tất cả', value: 0 },
        { label: 'Khách sạn', value: 1 },
        { label: 'Du lịch', value: 2 },
        { label: 'Kinh nghiệm và lời khuyên', value: 3 }
    ];

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            await fetchNews();
        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [renderCount]);

    useEffect(() => {
        if (responseAPI?.status != 200) {
            setVisibleError(true);
        } else
            setVisibleError(false);

    }, [responseAPI]);


    useEffect(() => {
        filter()
    }, [sortKey, activeIndex, news]);

    const filter = () => {
        if (activeIndex == 0) {
            if (!sortKey) {
                setNewsFilter(news?.filter((one: { is_deleted: boolean; }) => !one.is_deleted));
            }
            else {
                setNewsFilter(news?.filter(one => one.type == sortKey && !one?.is_deleted));

            }
        }
        else {
            if (!sortKey) {
                setNewsFilter(news?.filter((one: { is_deleted: boolean; }) => one.is_deleted));
            }
            else {
                setNewsFilter(news?.filter(one => one.type == sortKey && one.is_deleted));

            }
        }
    };


    const fetchNews = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/news/get-list`, {
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

    const handleChangeStatus = async () => {

        try {

            const response = await fetch(`/api/news/${one?.id}/change-status`, {
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
    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:items-center">

            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Đang hoạt động" rightIcon="pi pi-check-circle ml-2" >
                </TabPanel>
                <TabPanel header="Bị Khóa" rightIcon="pi pi-ban ml-2">
                </TabPanel>
            </TabView>


            <h4 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>
                Tài Khoản
            </h4>

            <div className="text-right">
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Chủ đề" onChange={(e) => setSortKey(e.value)} style={{ marginRight: '.5em' }} />

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
                        // setVisibleCreate(true);
                        // setUser(null);
                    }}
                />
            </div>
        </div >
    );


    const renderContent = (rowData: Model.News) => {

        return <>

        </>
    }
    const actionBodyTemplate = (rowData: Model.News) => {

        // const handleClickDetail = () => {
        //     setVisible(true);
        // };
        // const handleClickUpdate = () => {
        //     setVisibleUpdateRole(true);
        // };
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
            // {
            //     label: 'Detail',
            //     icon: 'pi pi-eye',
            //     command: () => {
            //         handleClickDetail()
            //     }
            // },
            // {
            //     label: 'Update',
            //     icon: 'pi pi-sort-alt',
            //     command: () => {
            //         handleClickUpdate();
            //     }
            // },
            rowData.is_deleted ?
                {
                    label: 'Update-Active',
                    icon: 'pi pi-lock',
                    command: () => {
                        handleClickUpdateStatus();

                    }
                } :
                {
                    label: 'Update-Unactive',
                    icon: 'pi pi-lock-open',
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
                        <SpeedDial onClick={() => { setOne(rowData); }} model={items} direction="left" style={{ right: '3rem' }} />
                    </div>
                </div>
            </>
        )

    }

    return (
        <>

            <DataTable
                value={newsFilter}
                scrollable scrollHeight="400px"
                loading={loading}
                className="mt-3"
                globalFilter={globalFilter}
                header={header}
                paginator rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                tableStyle={{ minWidth: '50rem' }}
                style={{ fontSize: '14px' }}
            >
                <Column
                    header="STT"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    style={{ flexGrow: 1, flexBasis: '100px' }}
                ></Column>
                <Column field="title" header="Tiêu đề" style={{ flexGrow: 1, flexBasis: '160px' }} sortable className="font-bold"></Column>
                {/* <Column field="avatar" header="Ảnh" style={{ flexGrow: 1, flexBasis: '160px' }} body={(users) => avatarBodyTemplate(users)} className="font-bold"></Column> */}
                {/* <Column field="summary" header="Bộ phận" style={{ flexGrow: 1, flexBasis: '200px' }} body={(users) => roleBodyTemplate(users)}></Column> */}
                <Column field="summary" header="Tóm tắt" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column field="email" header="Email" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column body={(news) => actionBodyTemplate(news)}></Column>
            </DataTable>

        </>
    );
}

export default News;