import React, { useEffect, useState } from 'react'
import { CiEdit, HiUser } from '../../utils/icons'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../firebaseConfig';
import TemplateUploadImages from '../core/TemplateUploadImages';
import { Checkbox } from '@material-tailwind/react';
import { Model } from '../../interface';
import { toast } from 'react-toastify';
import { Image } from 'primereact/image';
import { Calendar } from 'primereact/calendar';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

type FormValues = {
    name: string;
    email: string;
    phone: string;
};

const PersonalDetails = () => {

    const id = getCookie('id');
    const phone = getCookie('phone')?.toString();
    const token = getCookie('jwt_token')?.toString();
    const [date, setDate] = useState<string | Date | Date[] | null>(null);


    const [emailUpdate, setEmailUpdate] = useState("");
    const [nameUpdate, setNameUpdate] = useState("");
    const [phoneUpdate, setPhone] = useState("");
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [roleId, setRoleId] = useState(1);
    const [avatar, setAvatar] = useState("");
    const [address, setAddress] = useState("");

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [visibleUpdateImage, setVisibleUpdateImage] = useState<boolean>(false);


    useEffect(() => {
        handleDetailUser(id)
    }, [])

    const handleSelectedFiles = async (files: File[]) => {
        setSelectedFiles(files);

    };


    const getGender = (gender: any) => {
        switch (gender) {

            case 0:
                return 'Nam';

            case 1:
                return 'Nữ';

            default:
                return 'Không xác định';

        }
    };

    const handleImageUpload = async (images: File) => {
        if (images) {

            const fileExtension = images.name.split('.').pop();
            const newFileName = `${uuidv4()}.${fileExtension}`;

            const storageRef = ref(storage, `users/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, images);

            try {
                const snapshot = await uploadTask;
                return await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.log('Lỗi khi tải lên hình ảnh:', error);
            }
        }
    };

    const handleUpdateUser = async () => {

        try {


            let url = `/api/users/${id}/update`;

            let downloadURL = await handleImageUpload(selectedFiles[0]);

            if (!downloadURL && !id) {
                downloadURL = avatar?.toString()
            }


            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    name: nameUpdate,
                    phone: phone,
                    email: emailUpdate,
                    birthday: birthDay,
                    gender: gender,
                    avatar: downloadURL,
                    role_id: roleId,
                    address: address,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log(data);

            deleteCookie("avatar")
            setCookie('avatar', downloadURL);

            return data;

        } catch (error) {
            console.error('Error fetching:', error);

        }
    };

    const handleDetailUser = async (id: any) => {


        let token = getCookie('jwt_token')?.toString();
        //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật

        const url = `/api/users/${id}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: !token ? "" : token
            }),
        });

        const data = await response.json();
        console.log(data.data);


        if (data.data) {
            setGender(data.data.gender);
            setBirthDay(data.data.birthday);
            setDate(convertToDate(data.data.birthday));
            setRoleId(data.data.role_id)
            setNameUpdate(data.data.name);
            setEmailUpdate(data.data.email);
            setAvatar(data.data.avatar);
            setPhone(data.data.phone);
            setAddress(data.data.address);
        }


        return data;
    }

    const sumitInfor = async () => {

        console.log(nameUpdate, phoneUpdate, emailUpdate, birthDay, selectedFiles);

        if (nameUpdate == '' || !phoneUpdate || !emailUpdate || !birthDay) {

            toast.warning("Vui lòng điền đầy đủ thông tin!");

        }
        else {
            let data = await handleUpdateUser();
            if (data.status == 200) {
                toast.success("Cập nhật thành công!");


            } else toast.warning("Cập nhật thất bại, vui lòng thử lại!");

        }
    }




    const formatDate = (date: Date | null): string => {


        if (date instanceof Date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return '';
    };
    const convertToDate = (dateString: string): Date => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };
    const handleChangeDate = (e: any): void => {
        setBirthDay(formatDate(e));
        setDate(e)

    }

    return (
        <div>
            <div>
                <h1 className="font-bold text-2xl">Thông tin cá nhân</h1>
                <h2>Cập nhật thông tin của bạn và tìm hiểu cách nó được sử dụng.</h2>
            </div>
            <div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Ảnh đại diện</span>

                    <div className="w-full relative">
                        {avatar ?

                            <Avatar image={avatar} size="xlarge" shape="circle" />


                            :
                            <div>
                                <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />

                            </div>
                        }
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="phone-input"
                            onClick={() => setVisibleUpdateImage(!visibleUpdateImage)}>
                            <CiEdit />
                        </label>
                        <Dialog visible={visibleUpdateImage} maximizable onHide={() => setVisibleUpdateImage(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Cập nhật">
                            <div>
                                <TemplateUploadImages onSelectedFiles={(e) => handleSelectedFiles(e)}  ></TemplateUploadImages>

                                <br />

                                <div className='button-save-cancel' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div>
                                        <Button onClick={() => setVisibleUpdateImage(false)} label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} />
                                        <Button onClick={() => { setVisibleUpdateImage(false), setSelectedFiles([]) }} label="Hủy" severity="danger" icon="pi pi-times" />
                                    </div>
                                </div>
                            </div>
                        </Dialog>

                    </div>
                </div>

                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Tên hiển thị</span>
                    <div className="w-full relative">
                        <input type="text" id="name-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={nameUpdate}
                            onChange={(e) => setNameUpdate(e.target.value)}
                        />
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="name-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Email</span>
                    <div className="w-full relative">
                        <input type="text" id="email-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={emailUpdate}
                            onChange={(e) => setEmailUpdate(e.target.value)}
                        />
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="email-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                {/* <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Số điện thoại</span>
                    <div className="w-full relative">
                        <input type="text" id="phone-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={phoneUpdate}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="phone-input">
                            <CiEdit />
                        </label>
                    </div>
                </div> */}
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Ngày sinh</span>
                    <div className="w-full relative">

                        <Calendar id="birthday-input" value={date} onChange={(e: any) => handleChangeDate(e.value)} dateFormat="dd/mm/yy" />
                        {/* <input type="text" id="phone-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value)}
                        /> */}
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="birthday-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Địa chỉ</span>
                    <div className="w-full relative">
                        <input type="text" id="name-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="name-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Giới tính</span>
                    <div className="w-full relative flex" >
                        <div className="items-center flex flex-row text-sm">
                            <Checkbox color="blue" defaultChecked={false} checked={parseInt(gender) == 0 ? true : false} onResize={undefined} onResizeCapture={undefined} onChange={() => setGender('0')} />
                            <p className="items-center text-sm">Nam </p>
                        </div>
                        <div className="items-center flex flex-row text-sm">
                            <Checkbox color="blue" defaultChecked={false} onResize={undefined} checked={parseInt(gender) == 1 ? true : false} onResizeCapture={undefined} onChange={() => setGender('1')} />
                            <p className="items-center">Nữ</p>
                        </div>
                    </div>
                </div>

                <button
                    className="float-right w-max text-white bg-lightPrimary px-2.5 py-2 rounded-md mt-4"
                    onClick={sumitInfor}
                > Cập nhật

                </button>
            </div>

        </div >
    )
}

export default PersonalDetails
