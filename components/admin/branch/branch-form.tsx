import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import TemplateDemo from '../../../pages/admin/branches/test2';


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


    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [onClickSave, setOnClickSave] = useState(false);
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
            setId(currentBranch.id);
            setName(currentBranch.name);
            setEmail(currentBranch.email);
            setPhone(currentBranch.phone);
            setAddress(currentBranch.address);

        } else {

            // Nếu currentBranch là null, reset state về giá trị ban đầu
            setId(0);
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
        }
    }, [currentBranch]);



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
        if (!data.address) {
            newErrors.address = 'Địa chỉ không được để trống.';
        }

        return newErrors;
    };


    const handleSave = async () => {
        const newErrors = validate({ name, email, phone, address });
        setErrors(newErrors);
        setOnClickSave(true);
        if (Object.keys(newErrors).length === 0) {
            setVisible(false);
            onSave();

            await handleCreateUpdate();


        }
    };

    const handleCreateUpdate = async () => {

        try {
            let token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTMyMTIxMjQiLCJpYXQiOjE2ODY3Mjg1MzcsImV4cCI6MTY4NjgxNDkzN30.7dQ277H0QpGOJX1M6KHn_r-jVW4bKvhRB7k3CcKf1PzjoRCV3SGKaWvHBgHGrjgq6ZmybsjPRx26_ZV59zT_Qg'
            //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
            let url = id == 0 ? `/api/branches/create` : `/api/branches/${id}/update`;
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    address: address,
                    phone: phone,
                    email: email
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: token
                }),
            });
            const data = await response.json();
            console.log('data:', data);

        } catch (error) {
            console.error('Error fetching branches:', error);

        }
    };


    return (
        <div >
            {/* <Toast ref={toast} /> */}

            <form onSubmit={(e) => { handleSubmit(e) }} >

                <div className="card p-fluid" >
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

                    <div >
                        <TemplateDemo></TemplateDemo>
                        <br />
                    </div>

                </div>


                <div style={{ textAlign: 'right' }}>
                    <Button label="Save" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                    <Button label="Cancel" severity="danger" icon="pi pi-times" onClick={() => { setVisible(false); setOnClickSave(false); }} />
                </div>

            </form >

        </div >
    );
};

export default BranchForm;
