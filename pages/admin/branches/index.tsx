
import React, { useRef } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import BranchForm from '../../../components/admin/branch/branch-form';
function Branch() {

    const [branches, setBranches] = useState<Model.Branch[]>([]);
    const [branch, setBranch] = useState<Model.Branch | null>();
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [confirmPopup, setConfirmPopup] = useState(false);
    const toast = useRef<Toast>(null);
    const buttonEl = useRef(null);


    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/branches", {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
            });

            const data = await response.json();
            console.log(data);

            // Cập nhật giá trị branches trong state
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
                <span className={`branches-status status-${status}`}>{statusMessage}</span>

            </>
        );
    };


    const actionBodyTemplate = (branches: Model.Branch) => {


        const accept = () => {
            toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        };

        const reject = () => {
            toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        };

        const handleEditBranch = (branches: Model.Branch) => {
            setBranch(branches);
            setVisible(true);
        };

        return (
            <>

                <Toast ref={toast} />
                <ConfirmPopup target={buttonEl.current ? buttonEl.current : undefined} visible={confirmPopup} onHide={() => setConfirmPopup(false)}
                    message="Bạn có chắc muốn tiếp tục?" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel="Có"
                    rejectLabel="Không" />

                {branches.status
                    ? <span className="pi pi-times" onClick={() => setConfirmPopup(true)} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                    : <span className="pi pi-check" onClick={() => setConfirmPopup(true)} style={{ marginRight: '1em', fontSize: '1rem' }}></span>
                }
                <span className="pi pi-pencil" onClick={() => handleEditBranch(branches)} style={{ marginRight: '0.5em', fontSize: '1rem' }}  ></span>
            </>
        );
    };

    const toolbarLeftTemplate = () => {

        return (
            <>


                <Button label="New" icon="pi pi-plus" style={{ marginRight: '.5em' }} onClick={() => {
                    setVisible(true);
                    setBranch(null);
                }} />
            </>
        );
    };

    const showSuccess = () => {
        let message = !branch ? 'Tạo mới thành công' : 'Cập nhật thành công';
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
    }


    return (

        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <Toolbar start={<h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>Chi nhánh</h1>} end={() => toolbarLeftTemplate()}> </Toolbar>

                    <DataTable value={branches} scrollable scrollHeight="400px" loading={loading} className="mt-3">
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