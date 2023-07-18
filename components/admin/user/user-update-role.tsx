import { useEffect, useState } from "react";
import { Model } from "../../../interface";
import { getCookie } from "cookies-next";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CustomErrorPage from "../custom-error";

interface Props {

    user: Model.User | null;
    setVisibleUpdateRole: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}

const roleOptions = [
    { name: 'Khách hàng', value: 1 },
    { name: 'Nhân viên', value: 2 },
    { name: 'Quản lý', value: 3 },
    { name: 'Admin', value: 4 }
];


const UserUpdateRole: React.FC<Props> = ({
    user,
    setVisibleUpdateRole,
    onSave
}) => {

    const [roleUpdate, setRoleUpdate] = useState(0);
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const token = getCookie('jwt_token')?.toString();
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });


    useEffect(() => {
        if (user) {
            setRoleUpdate(user.role_id)

        }
    }, [user]);




    const handleSave = async () => {
        let data = await handleUpdate();


        if (data?.status == 200) {
            setVisibleUpdateRole(false);
            onSave();
        } else {

            setVisibleError(true);


        }
    };

    const handleUpdate = async () => {

        try {

            const response = await fetch(`/api/users/${user?.id}/update-role`, {
                method: "POST",
                body: JSON.stringify({
                    role_id: roleUpdate
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

                <div className="field" style={{ marginTop: '1rem' }}>
                    <span className="p-float-label">
                        <Dropdown id="role_id" options={roleOptions} value={roleUpdate} onChange={(e) => setRoleUpdate(e.value)} optionLabel="name"></Dropdown>
                        <label htmlFor="role_id">Bộ phận: </label>
                    </span>

                </div>
            </div >
            <div style={{ textAlign: 'right' }}>
                <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisibleUpdateRole(false); }} />
            </div>


            {responseAPI?.status != 200 ?
                <>

                    <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} >

                        <CustomErrorPage props={responseAPI} />

                    </Dialog>
                </>
                : null
            }

        </>

    )
}

export default UserUpdateRole;