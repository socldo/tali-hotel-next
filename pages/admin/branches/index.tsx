
import React, { useEffect, useRef, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import BranchForm from '../../../components/admin/branch/branch-form';
import querystring from 'querystring';
import { InputText } from 'primereact/inputtext';
import { Image } from 'primereact/image';
import { getCookie } from 'cookies-next'
import { TabView, TabPanel } from 'primereact/tabview';
import adminAuthMiddleware from '../../../components/admin/middleware/adminAuthMiddleware';
import { toast } from 'react-toastify'
import { Branch } from '../../../interface/index'

function Branch() {

    const [branches, setBranches] = useState<Branch[]>([]);
    const [branchFilters, setBranchFilters] = useState<Branch[]>([]);

    const [branch, setBranch] = useState<Branch | null>();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [renderCount, setRenderCount] = useState(0);
    const buttonEl = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');

    const [activeIndex, setActiveIndex] = useState(0);


    const token = getCookie('jwt_token')?.toString();


    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(async () => {
            await fetchBranches();
        }, 500);

        return () => {
            clearTimeout(timer); // Xóa bỏ timer nếu component unmount trước khi kết thúc thời gian chờ
        };
    }, [renderCount]);

    useEffect(() => {
        filter()
    }, [activeIndex, branches]);

    const filter = () => {
        if (activeIndex == 0) {

            setBranchFilters(branches.filter((branch: { status: boolean; }) => branch.status));

        }
        else {

            setBranchFilters(branches.filter((branch: { status: boolean; }) => !branch.status));


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

            setBranchFilters(data.data.filter((branch: { status: boolean; }) => branch.status == true));
        } catch (error) {
            console.error('Error fetching:', error);
            setLoading(false);
        }
    };



    const imageBodyTemplate = (rowData: Branch) => {
        let image = rowData.images ? rowData.images : "";


        return (
            <>
                <div className=" flex justify-content-center">
                    <Image src={image} zoomSrc={image} alt="Image" width="80" height="60" preview />
                </div>
            </>
        )
    };


    const handleChangeStatus = async () => {

        try {

            const response = await fetch(`/api/branches/${branch?.id}/change-status`, {
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
            setRenderCount(renderCount + 1);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const actionBodyTemplate = (rowData: Branch) => {

        const accept = async () => {
            setLoading(false);
            await handleChangeStatus()
            toast.success('Cập nhật thành công');
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')
        };


        return (
            <>


                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />


                {rowData.status
                    ?
                    <Button icon="pi pi-times" onClick={() => { setConfirmPopup(true); setBranch(rowData); }} rounded outlined severity="danger" aria-label="Bookmark" size="small" />
                    :
                    <Button icon="pi pi-check" onClick={() => { setConfirmPopup(true); setBranch(rowData); }} rounded outlined severity="success" aria-label="Bookmark" size="small" />
                }
                <Button icon="pi pi-eye" onClick={() => { setVisible(true); setBranch(rowData) }} outlined rounded severity="info" aria-label="Bookmark" size="small" style={{ marginLeft: '0.2rem' }} />

                <Button icon="pi pi-pencil" rounded outlined severity="secondary" aria-label="Bookmark" size="small" style={{ marginLeft: '0.2rem' }} />

            </>
        );
    };

    // const toolbarLeftTemplate = () => {

    //     return (
    //         <>


    //             <Button label="New" icon="pi pi-plus" style={{ marginRight: '.5em' }} onClick={() => {
    //                 setVisible(true);
    //                 setBranch(null);
    //             }} />
    //         </>
    //     );
    // };

    const showSuccess = () => {
        setRenderCount(renderCount => renderCount + 1);

        let message = !branch ? 'Tạo mới thành công' : 'Cập nhật thành công';
        toast.success(message);


    }


    const header = (

        <div className="flex flex-column md:flex-row md:justify-between md:items-center" >
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Đang hoạt động" rightIcon="pi pi-check-circle ml-2" >
                </TabPanel>
                <TabPanel header="Tạm ngưng" rightIcon="pi pi-ban ml-2">
                </TabPanel>
            </TabView>


            <h4 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>
                Khu vực
            </h4>

            <div className="text-right">
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
                        setVisible(true);
                        setBranch(null);
                    }}
                />
            </div>
        </div>

    );


    return (
        <>
            {/* <div className="grid">
                <div className="col-12"> */}
            {/* <div className="card" > */}

            <DataTable
                value={branchFilters}
                scrollable scrollHeight="400px"
                loading={loading}
                className="mt-3"
                globalFilter={globalFilter}
                header={header}
                paginator rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                tableStyle={{ minWidth: '30rem' }}
            >
                <Column
                    header="STT"
                    body={(_, { rowIndex }) => rowIndex + 1}
                    style={{ flexGrow: 1, flexBasis: '100px' }}
                ></Column>
                <Column field="name" header="Tên" style={{ flexGrow: 1, flexBasis: '160px' }} sortable className="font-bold"></Column>
                <Column field="images" header="Ảnh" style={{ flexGrow: 1, flexBasis: '160px' }} body={(branches) => imageBodyTemplate(branches)} className="font-bold"></Column>
                {/* <Column field="phone" header="Số điện thoại" style={{ flexGrow: 1, flexBasis: '200px' }}></Column> */}
                {/* <Column field="email" header="Email" style={{ flexGrow: 1, flexBasis: '200px' }}></Column> */}
                <Column field="address" header="Địa chỉ" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                {/* <Column field="status" header="Trạng thái" style={{ flexGrow: 1, flexBasis: '200px' }} body={(branches) => statusBodyTemplate(branches)}></Column> */}
                <Column body={(branches) => actionBodyTemplate(branches)}></Column>

            </DataTable>


            <Dialog visible={visible} maximizable onHide={() => setVisible(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header={!branch ? "Tạo mới" : "Cập nhật"}>
                <BranchForm setVisible={setVisible} currentBranch={branch || null} onSave={() => showSuccess()} />

            </Dialog>

            {/* </div > */}
            {/* </div >
            </div > */}
        </>
    );
}

export default adminAuthMiddleware(Branch);