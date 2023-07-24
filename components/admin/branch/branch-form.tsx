import React, { useEffect, useState } from 'react';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getCookie } from 'cookies-next'
import { Model } from '../../../interface';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import TemplateUploadImages from '../../core/TemplateUploadImages';
import CustomErrorPage from '../custom-error';
import { Dialog } from 'primereact/dialog';

type FormErrors = {
    name?: string;
    address?: string;
};

interface BranchFormProps {

    currentBranch: Model.Branch | null;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({
    currentBranch,
    setVisible,
    onSave
}) => {


    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [onClickSave, setOnClickSave] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);

    const token = getCookie('jwt_token')?.toString();


    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        address: ''
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
                address: ''
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


        if (!data.address) {
            newErrors.address = 'Địa chỉ không được để trống.';
        }

        return newErrors;
    };


    const handleSave = async () => {


        const newErrors = validate({ name, address });
        setErrors(newErrors);
        setOnClickSave(true);
        if (Object.keys(newErrors).length === 0) {

            let data = await handleCreateUpdate();

            if (data?.status == 200) {
                setVisible(false);
                onSave();
            } else {
                setVisibleError(true);
            }
        }

    };

    const handleCreateUpdate = async () => {

        try {
            //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
            let url = id == 0 ? `/api/branches/create` : `/api/branches/${id}/update`;

            let downloadURL = await handleImageUpload(selectedFiles[0]);

            if (!downloadURL && id != 0) {

                downloadURL = currentBranch?.images
            }


            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    address: address,
                    phone: phone,
                    email: email,
                    images: downloadURL,
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

    const handleSelectedFiles = async (files: File[]) => {
        setSelectedFiles(files);

    };

    const handleImageUpload = async (images: File) => {
        if (images) {

            const fileExtension = images.name.split('.').pop();
            const newFileName = `${uuidv4()}.${fileExtension}`;

            const storageRef = ref(storage, `branches/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, images);

            try {
                const snapshot = await uploadTask;
                return await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.log('Lỗi khi tải lên hình ảnh:', error);
            }
        }
    };


    return (
        <div >


            <form onSubmit={(e) => { handleSubmit(e) }} >

                <div className="card p-fluid" >
                    <div className="field">
                        <label htmlFor="name" >Tên Khu Vực</label>
                        <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
                    </div>
                    {getFormErrorMessage('name')}

                    <div className="field">
                        <label htmlFor="address">Địa chỉ</label>
                        <InputText id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    {getFormErrorMessage('address')}



                </div>

                <div >
                    <TemplateUploadImages onSelectedFiles={(e) => handleSelectedFiles(e)}  ></TemplateUploadImages>
                    <br />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                    <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisible(false); setOnClickSave(false); }} />
                </div>


                {responseAPI?.status != 200 ?
                    <>

                        <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Lỗi rồi">

                            <CustomErrorPage props={responseAPI} />

                        </Dialog>
                    </>
                    : null
                }

            </form >

        </div >
    );

};
export default BranchForm;


