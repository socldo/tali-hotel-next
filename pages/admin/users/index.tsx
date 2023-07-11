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


function User() {

    const [users, setUsers] = useState<Model.User[]>([]);
    const [usersFilter, setUsersFilter] = useState<Model.User[]>([]);
    const [user, setUser] = useState<Model.User | null>();
    const [loading, setLoading] = useState(true);
    const [renderCount, setRenderCount] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');
    const [confirmPopup, setConfirmPopup] = useState(false);
    const buttonEl = useRef(null);
    const [sortKey, setSortKey] = useState(null);
    const [visible, setVisible] = useState<boolean>(false);



    const sortOptions = [
        { label: 'Tất cả', value: 0 },
        { label: 'Khách hàng', value: 1 },
        { label: 'Quản lý', value: 2 },
        { label: 'Nhân viên', value: 3 },
        { label: 'Admin', value: 4 }
    ];

    const token = getCookie('jwt_token')?.toString();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(async () => {
            await fetchUsers();

        }, 500);



        return () => {
            clearTimeout(timer); // Xóa bỏ timer nếu component unmount trước khi kết thúc thời gian chờ
        };

    }, [renderCount]);

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
            setUsersFilter(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;
        console.log(value);

        setSortKey(value);
        if (value != 0) {
            setUsersFilter(users?.filter(users => users.role_id == value));
        }
        else {
            setUsersFilter(users)
        }

    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:items-center">

            <h4 className="m-0" style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'left' }}>
                Danh Sách Tài Khoản
            </h4>

            <div className="text-right">
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Bộ phận" onChange={onSortChange} style={{ marginRight: '.5em' }} />

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
                        // setVisible(true);
                        // setBranch(null);
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
            setRenderCount(renderCount + 1);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };


    const actionBodyTemplate = (rowData: Model.User) => {

        const accept = async () => {
            setLoading(false);
            await handleChangeStatus()
            toast.success('Cập nhật thành công')
        };

        const reject = () => {
            toast.warn('Từ chối cập nhật')


        };

        // const handleEditBranch = (branch: Model.Branch) => {

        //     setBranch(branch);
        //     setVisible(true);


        return (
            <>
                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />

                {rowData.is_locked
                    ? <span className="pi pi-times" onClick={() => { setConfirmPopup(true); setUser(rowData); }} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                    : <span className="pi pi-check" onClick={() => { setConfirmPopup(true); setUser(rowData); }} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                }
                <span className="pi pi-eye" style={{ marginRight: '0.5em', fontSize: '1rem' }} onClick={() => { setVisible(true); setUser(rowData) }} ></span>
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

        </>
    );
}

export default User;