import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getCookie } from 'cookies-next'
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Model } from '../../../interface';

type FormErrors = {
    name?: string;
    email?: string;
    phone?: string;
    roleId: number;
};

const roleOptions = [
    { name: 'Khách hàng', value: 1 },
    { name: 'Quản lý', value: 2 },
    { name: 'Nhân viên', value: 3 },
    { name: 'Admin', value: 4 }
];


interface UserProps {

    currentUser: Model.User | null;
    setVisibleCreate: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}

const UserCreate: React.FC<UserProps> = ({
    currentUser,
    setVisibleCreate,
    onSave
}) => {


    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState(0);
    const [onClickSave, setOnClickSave] = useState(false);

    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);

    const token = getCookie('jwt_token')?.toString();


    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        phone: '',
        roleId: 0
    });


    useEffect(() => {


        setId(0);
        setName('');
        setEmail('');
        setPhone('');
        setRole(0);

    }, []);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let value = {
            name: name,
            email: email,
            phone: phone,
            roleId: role

        }
        const newErrors = validate({ ...value });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            //gửi api
            // setValues({
            //     value: '',
            //     email: ''
            // });
            setErrors({
                name: '',
                email: '',
                phone: '',
                roleId: 0
            });
        }

    };

    const isFormFieldInvalid = (name: keyof FormErrors) => !!errors[name];

    const getFormErrorMessage = (name: keyof FormErrors) => {
        const error = errors[name];
        return isFormFieldInvalid(name) && onClickSave ? (
            <small className="p-error">{error}</small>
        ) : (
            <small className="p-error">&nbsp;</small>
        );
    };

    const validate = (data: any) => {
        let newErrors: any = {};

        if (!data.name) {
            newErrors.name = 'Tên không không được để trống.';
        }

        if (!data.email) {
            newErrors.email = 'Địa chỉ email không được để trống.';
        } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
            newErrors.email = 'Địa chỉ email không đúng định dạng.';
        }

        if (!data.phone) {
            newErrors.phone = 'Số điện thoại không được để trống.';
        }
        if (data.roleId == 0) {
            newErrors.roleId = 'Vui lòng chọn bộ phận.'

        }
        return newErrors;
    };


    const handleSave = async () => {
        let newErrors = validate({ name, email, phone, role });

        console.log(role);
        // console.log(roleId);


        setErrors(newErrors);
        setOnClickSave(true);

        if (Object.keys(newErrors).length === 0) {


            let data = await handleCreate();

            if (data?.status == 200) {
                setVisibleCreate(false);
                onSave();
            } else {

                setVisibleError(true);


            }
        }

    };

    const handleCreate = async () => {

        try {

            const response = await fetch('/api/users/create', {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    role_id: role,
                    password: '0000'
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
        <div >

            <form onSubmit={(e) => { handleSubmit(e) }} >

                <div className="card p-fluid" >

                    <div className="field" style={{ marginTop: '1rem' }}>

                        <span className="p-float-label">
                            <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
                            <label htmlFor="name" >Tên</label>
                        </span>

                    </div>
                    {getFormErrorMessage('name')}
                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="email">Email</label>

                        </span>

                    </div>

                    {getFormErrorMessage('email')}

                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputText id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <label htmlFor="phone">Số điện thoại</label>
                        </span>

                    </div>
                    {getFormErrorMessage('phone')}

                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <Dropdown id="role_id" options={roleOptions} value={role != 0 ? role : null} onChange={(e) => setRole(e.value)} optionLabel="name"></Dropdown>
                            <label htmlFor="role_id">Bộ phận</label>
                        </span>
                        {getFormErrorMessage('roleId')}

                    </div>
                </div>


                <div style={{ textAlign: 'right' }}>
                    <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                    <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisibleCreate(false); setOnClickSave(false); }} />
                </div>

            </form >

            {responseAPI?.status != 200 ?
                <>

                    <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Lỗi rồi">

                        <div>Lỗi rồi:  {responseAPI?.message}</div>

                    </Dialog>
                </>
                : null
            }
        </div >
    );
};

export default UserCreate;


