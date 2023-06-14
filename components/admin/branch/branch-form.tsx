import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';


type FormErrors = {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
};

interface BranchFormProps {

    currentBranch: Model.Branch | null;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
    // toast: React.RefObject<Toast>;
}

const BranchForm: React.FC<BranchFormProps> = ({
    currentBranch,
    setVisible,
    onSave,
    // toast
}) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const toast = useRef<Toast>(null);

    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        address: '',
        phone: ''
    });


    useEffect(() => {
        if (currentBranch) {

            // Nếu currentBranch có giá trị, gán giá trị của các cột vào state tương ứng
            setName(currentBranch.name);
            setEmail(currentBranch.email);
            setPhone(currentBranch.phone);
            setAddress(currentBranch.address);

        } else {

            // Nếu currentBranch là null, reset state về giá trị ban đầu
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
        }
    }, [currentBranch]);


    // const handleSubmit = (e: any) => {
    //     e.preventDefault();
    //     // Xử lý dữ liệu khi form được gửi api

    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(email)) {

    //         // xữ lý giúp tôi nếu vào trường họp lỗi này sẽ ấn được nút save nhưng không ẩn đi form và hiện thông báo lỗi 

    //         toast.current?.show({
    //             severity: 'error',
    //             summary: 'Invalid Email',
    //             detail: 'Please enter a valid email address.',
    //         });
    //         return;
    //     }

    //     console.log('Name:', name);
    //     console.log('Address:', address);

    // };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let value = {
            name: name,
            email: email,
            phone: phone,
            address: address

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
                address: '',
                phone: ''
            });
        }
    };

    const isFormFieldInvalid = (name: keyof FormErrors) => !!errors[name];

    const getFormErrorMessage = (name: keyof FormErrors) => {
        const error = errors[name];
        return isFormFieldInvalid(name) ? (
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
        if (!data.address) {
            newErrors.address = 'Địa chỉ không được để trống.';
        }

        return newErrors;
    };


    const handleSave = () => {
        const newErrors = validate({ name, email, phone, address });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setVisible(false);
            onSave();
        }
    };



    return (
        <div >
            {/* <Toast ref={toast} /> */}

            <form onSubmit={(e) => { handleSubmit(e) }}  >

                <div className="card p-fluid">
                    <div className="field">
                        <label htmlFor="name" >Tên chi nhánh</label>
                        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
                    </div>
                    {getFormErrorMessage('name')}
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {getFormErrorMessage('email')}
                    <div className="field">
                        <label htmlFor="address">Địa chỉ</label>
                        <InputText id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    {getFormErrorMessage('address')}

                    <div className="field">
                        <label htmlFor="phone">Số điện thoại</label>
                        <InputText id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    {getFormErrorMessage('phone')}
                </div>


                <div style={{ textAlign: 'right' }}>
                    <Button label="Save" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                    <Button label="Cancel" severity="danger" icon="pi pi-times" onClick={() => setVisible(false)} />
                </div>

            </form>

        </div >
    );
};

export default BranchForm;
