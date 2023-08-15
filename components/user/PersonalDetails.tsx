import React, { useEffect, useState } from 'react'
import { CiEdit } from '../../utils/icons'
import { getCookie } from 'cookies-next'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../firebaseConfig';
import TemplateUploadImages from '../core/TemplateUploadImages';
import { Checkbox } from '@material-tailwind/react';
import { Model } from '../../interface';
import { toast } from 'react-toastify';
import { Image } from 'primereact/image';
import { Calendar } from 'primereact/calendar';

type FormValues = {
    name: string;
    email: string;
    phone: string;
};

const PersonalDetails = () => {
    const email = getCookie('email');
    const phone = getCookie('phone');
    const userName = getCookie('name');
    const role = getCookie('role');
    const avatar = getCookie('avatar');
    const id = getCookie('id');
    const token = getCookie('jwt_token')?.toString();
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });



    const [emailUpdate, setEmail] = useState(email?.toString());
    const [nameUpdate, setName] = useState(userName?.toString());
    const [phoneUpdate, setPhone] = useState(phone?.toString());
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [isUpdateAvatar, setIsUpdateAvatar] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
            //Nếu id = 0 thì sẽ tạo mới, không thì sẽ cập nhật
            let url = `/api/users/${id}/update`;

            let downloadURL = await handleImageUpload(selectedFiles[0]);
            console.log(downloadURL);

            if (!downloadURL && !id) {
                downloadURL = avatar?.toString()
            }

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    name: userName,
                    phone: phone,
                    email: email,
                    birthday: birthDay,
                    gender: gender,
                    avatar: downloadURL
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


            setGender(data.data.gender)
            setBirthDay(data.data.birthday)
            console.log(data.data.birthday);


        }


        return data;
    }

    const sumitInfor = async () => {
        if (nameUpdate == '' || !phoneUpdate || !emailUpdate || !birthDay || !(selectedFiles && avatar)) {
            console.log(nameUpdate);
            toast.warning("Vui lòng điền đầy đủ thông tin!");

        } else {
            let data = await handleUpdateUser();
            if (data.status == 200) {
                setIsUpdateAvatar('0');
                toast.success("Cập nhật thành công!");
            } else toast.warning("Cập nhật thất bại, vui lòng thử lại!");

        }
    }

    useEffect(() => {
        handleDetailUser(id)
    }, [])

    return (
        <div>
            <div>
                <h1 className="font-bold text-2xl">Thông tin cá nhân</h1>
                <h2>Cập nhật thông tin của bạn và tìm hiểu cách nó được sử dụng.</h2>
            </div>
            <div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Tên hiển thị</span>
                    <div className="w-full relative">
                        <input type="text" id="name-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={nameUpdate}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="name-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Địa chỉ email</span>
                    <div className="w-full relative">
                        <input type="text" id="email-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={emailUpdate}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="email-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
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
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Ngày sinh</span>
                    <div className="w-full relative">

                        <Calendar value={birthDay} onChange={(e: any) => setBirthDay(e.value)} dateFormat="dd/mm/yy" />
                        {/* <input type="text" id="phone-input"
                            className="border-none rounded w-full md:p-4 pr-12"
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value)}
                        /> */}
                        <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                            htmlFor="phone-input">
                            <CiEdit />
                        </label>
                    </div>
                </div>
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Giới tính</span>
                    <div className="w-full relative">
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
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full items-center ">
                    <span className="w-full md:w-1/4 font-medium">Ảnh đại diện</span>
                    <div className="w-full relative">
                        {isUpdateAvatar.toString() == '1'
                            ? <><TemplateUploadImages onSelectedFiles={(e) => handleSelectedFiles(e)}  ></TemplateUploadImages>
                                <br /></>
                            : <>
                                <Image
                                    width="240"
                                    height="240"
                                    src={avatar?.toString()}
                                    preview
                                />
                                <label className="absolute inset-y-0 right-4 inline-flex items-center cursor-pointer"
                                    htmlFor="phone-input"
                                    onClick={() => setIsUpdateAvatar('1')}>
                                    <CiEdit />
                                </label>
                            </>
                        }
                    </div>
                </div>
                <button
                    className="float-right w-max text-white bg-lightPrimary px-2.5 py-2 rounded-md mt-4"
                    onClick={sumitInfor}
                > Cập nhật

                </button>
            </div>

        </div>
    )
}

export default PersonalDetails
