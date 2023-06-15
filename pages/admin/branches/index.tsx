
import React, { useEffect, useRef, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import BranchForm from '../../../components/admin/branch/branch-form';
import querystring from 'querystring';
import { InputText } from 'primereact/inputtext';



function Branch() {

    const [branches, setBranches] = useState<Model.Branch[]>([]);
    const [branch, setBranch] = useState<Model.Branch | null>();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const [renderCount, setRenderCount] = useState(0);
    const toast = useRef<Toast>(null);
    const buttonEl = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwODEyMzEyMzEiLCJpYXQiOjE2ODY4MTU1MTYsImV4cCI6MTY4NjkwMTkxNn0.lONZPTtdFXx2gsboi_vBh0jxrdafdNyg4b_w7AS1oC_qzH7ftk9CLYDv3hL4PU9RkddlqZzDgLWJ3k-wVc-k4A'


    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(async () => {
            await fetchBranches();
        }, 500);

        return () => {
            clearTimeout(timer); // Xóa bỏ timer nếu component unmount trước khi kết thúc thời gian chờ
        };
    }, [renderCount]);

    const fetchBranches = async (): Promise<void> => {
        try {
            const queryParams = querystring.stringify({ status: -1 });
            const response = await fetch(`/api/branches?${queryParams}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setBranches(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching branches:', error);
            setLoading(false);
        }
    };


    const statusBodyTemplate = (rowData: Model.Branch) => {

        let status = rowData.status ? 'active' : 'unactive';
        let statusMessage = rowData.status ? 'Đang hoạt động' : 'Tạm ngưng';

        return (
            <>
                <span className={`branches-status status-${status}`} style={rowData.status ? {
                    borderRadius: 'var(--border-radius)',
                    padding: '.25em .5rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '.3px',
                    background: '#07f207',
                    color: '#121111'
                } : {
                    borderRadius: 'var(--border-radius)',
                    padding: '.25em .5rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '.3px',
                    background: '#e40f25',
                    color: '#121111'
                }

                }
                >{statusMessage}</span >

            </>
        );
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
                    Authorization: token
                }),
            });
            const data = await response.json();
            console.log('data:', data);
            setRenderCount(renderCount + 1);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const actionBodyTemplate = (rowData: Model.Branch) => {

        const accept = async () => {
            setLoading(false);
            await handleChangeStatus()
            toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        };

        const reject = () => {
            toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        };

        const handleEditBranch = (branch: Model.Branch) => {

            setBranch(branch);
            setVisible(true);
        };





        return (
            <>

                <Toast ref={toast} />
                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />

                {rowData.status
                    ? <span className="pi pi-times" onClick={() => { setConfirmPopup(true); setBranch(rowData); }} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                    : <span className="pi pi-check" onClick={() => { setConfirmPopup(true); setBranch(rowData); }} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                }
                <span className="pi pi-pencil" onClick={() => handleEditBranch(rowData)} style={{ marginRight: '0.5em', fontSize: '1rem' }}  ></span>
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
        setRenderCount(renderCount + 1);
        let message = !branch ? 'Tạo mới thành công' : 'Cập nhật thành công';
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });

    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-between md:items-center">
            <h5 className="m-0" style={{ fontWeight: 'bold', fontSize: '28px', textAlign: 'left' }}>
                Chi nhánh
            </h5>
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
                    label="New"
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

        <div className="grid">
            <div className="col-12">
                <div className="card">

                    {/* <Toolbar start={<h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Chi nhánh</h1>} end={() => toolbarLeftTemplate()}> </Toolbar> */}

                    <DataTable
                        value={branches}
                        scrollable scrollHeight="400px"
                        loading={loading}
                        className="mt-3"
                        globalFilter={globalFilter}
                        header={header}
                    >
                        <Column
                            header="STT"
                            body={(_, { rowIndex }) => rowIndex + 1}
                            style={{ flexGrow: 1, flexBasis: '100px' }}
                        ></Column>
                        <Column field="name" header="Tên" style={{ flexGrow: 1, flexBasis: '160px' }} className="font-bold"></Column>
                        <Column field="phone" header="Số điện thoại" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="email" header="Email" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="address" header="Địa chỉ" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="status" header="Trạng thái" style={{ flexGrow: 1, flexBasis: '200px' }} body={(branches) => statusBodyTemplate(branches)}></Column>
                        <Column body={(branches) => actionBodyTemplate(branches)}></Column>
                    </DataTable>

                    <Dialog visible={visible} onHide={() => setVisible(false)} style={{ width: '50vw' }} header={!branch ? "Tạo mới" : "Cập nhật"}>
                        <BranchForm setVisible={setVisible} currentBranch={branch || null} onSave={() => showSuccess()} />

                    </Dialog>

                </div>
            </div>

        </div >

    );
}

export default Branch;