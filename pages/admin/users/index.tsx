import React, { useEffect, useRef, useState } from 'react';
import querystring from 'querystring';
import { getCookie } from 'cookies-next';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { TabPanel, TabView } from 'primereact/tabview';
import { toast } from 'react-toastify'
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import UserDetail from '../../../components/admin/user/user-detail';
import { useRouter } from 'next/router';
import adminAuthMiddleware from '../../../components/admin/middleware/adminAuthMiddleware';
import UserCreate from '../../../components/admin/user/user-create';
import { status } from 'nprogress';
import CustomErrorPage from '../../../components/admin/custom-error';
import { Model } from '../../../interface/index'


function User() {

    const [users, setUsers] = useState<Model.User[]>([]);
    const [usersFilter, setUsersFilter] = useState<Model.User[]>([]);

    const [user, setUser] = useState<Model.User | null>();

    const [loading, setLoading] = useState(true);
    const [renderCount, setRenderCount] = useState(0);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const buttonEl = useRef(null);

    const [visible, setVisible] = useState<boolean>(false);
    const [visibleCreate, setVisibleCreate] = useState<boolean>(false);

    const [sortKey, setSortKey] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);


    const token = getCookie('jwt_token')?.toString();

    const sortOptions = [
        { label: 'Tất cả', value: 0 },
        { label: 'Khách hàng', value: 1 },
        { label: 'Quản lý', value: 2 },
        { label: 'Nhân viên', value: 3 },
        { label: 'Admin', value: 4 }
    ];



    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            await fetchUsers();
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
    }, [sortKey, activeIndex, users]);

    const filter = () => {
        if (activeIndex == 0) {
            if (!sortKey) {
                setUsersFilter(users?.filter((user: { is_locked: boolean; }) => !user.is_locked));
            }
            else {
                setUsersFilter(users?.filter(users => users.role_id == sortKey && !user?.is_locked));

            }
        }
        else {
            if (!sortKey) {
                setUsersFilter(users?.filter((user: { is_locked: boolean; }) => user.is_locked));
            }
            else {
                setUsersFilter(users?.filter(user => user.role_id == sortKey && user.is_locked));

            }
        }
    };

    const fetchUsers = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ status: -1 });
            const response = await fetch(`/api/users?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);


            setUsers(data.data);
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
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Bộ phận" onChange={(e) => setSortKey(e.value)} style={{ marginRight: '.5em' }} />

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
                        setUser(null);
                    }}
                />
            </div>
        </div >
    );

    const avatarBodyTemplate = (rowData: Model.User) => {
        let image = rowData.avatar ? rowData.avatar : "";

        return (
            <>
                <Avatar image={image} className="mr-2" size="large" shape="circle" />

            </>
        )
    };


    const handleChangeStatus = async () => {

        try {

            const response = await fetch(`/api/users/${user?.id}/change-status`, {
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


    const actionBodyTemplate = (rowData: Model.User) => {

        const accept = async () => {

            let changeStatus = await handleChangeStatus();

            if (changeStatus?.status === 200) {
                toast.success('Cập nhật thành công');
            }
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')


        };

        // const handleEditBranch = (branch: Branch) => {

        //     setBranch(branch);
        //     setVisible(true);


        return (
            <>
                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />

                {/* {rowData.is_locked
                    ? <span className="pi pi-times" onClick={() => { setConfirmPopup(true); setUser(rowData); }} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                    : <span className="pi pi-check" onClick={() => { setConfirmPopup(true); setUser(rowData); }} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                } */}
                {!rowData.is_locked
                    ?
                    <Button icon="pi pi-times" onClick={() => { setConfirmPopup(true); setUser(rowData); }} rounded outlined severity="danger" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />
                    :
                    <Button icon="pi pi-check" onClick={() => { setConfirmPopup(true); setUser(rowData);; }} rounded outlined severity="success" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />
                }
                <Button icon="pi pi-eye" onClick={() => { setVisible(true); setUser(rowData) }} outlined rounded severity="info" aria-label="Bookmark" size="small" style={{ margin: '0.1rem' }} />

                {/* <span className="pi pi-eye" style={{ marginRight: '0.5em', fontSize: '1rem' }} onClick={() => { setVisible(true); setUser(rowData) }} ></span> */}
            </>
        );


    };

    const roleBodyTemplate = (rowData: Model.User) => {
        let roleName = '';
        switch (rowData.role_id) {
            case 1:
                roleName = 'user'
                break;
            case 2:
                roleName = 'manager'
                break;
            case 3:
                roleName = 'employee'
                break;
            case 4:
                roleName = 'admin'
                break;
            default:
                break;
        }
        return <span className={`role-badge role-${roleName}`}>{roleName}</span>;
    };


    const showSuccess = () => {
        setRenderCount(renderCount => renderCount + 1);

        toast.success('Tạo mới thành công')
    }


    return (
        <>
            <DataTable
                value={usersFilter}
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
                <Column field="name" header="Tên" style={{ flexGrow: 1, flexBasis: '160px' }} sortable className="font-bold"></Column>
                <Column field="avatar" header="Ảnh" style={{ flexGrow: 1, flexBasis: '160px' }} body={(users) => avatarBodyTemplate(users)} className="font-bold"></Column>
                <Column field="role_id" header="Bộ phận" style={{ flexGrow: 1, flexBasis: '200px' }} body={(users) => roleBodyTemplate(users)}></Column>
                <Column field="phone" header="Số điện thoại" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column field="email" header="Email" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                <Column body={(users) => actionBodyTemplate(users)}></Column>
            </DataTable>

            <Dialog header="Chi tiết" visible={visible} onHide={() => setVisible(false)}
                style={{ width: '60vw' }} maximizable breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <p className="m-0">
                    <UserDetail user={user || null} />

                </p>
            </Dialog>

            <Dialog visible={visibleCreate} maximizable onHide={() => setVisibleCreate(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Tạo mới">

                <UserCreate setVisibleCreate={setVisibleCreate} currentUser={user || null} onSave={() => showSuccess()}></UserCreate>

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

export default adminAuthMiddleware(User);