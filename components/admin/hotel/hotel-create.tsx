import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getCookie } from 'cookies-next'
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import CustomErrorPage from '../custom-error';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Model } from '../../../interface';
import { InputNumber } from 'primereact/inputnumber';

type FormErrors = {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    area_id: number;
    type?: number;
    price: number;
};


interface HotelModel {

    id: number;
    branch_id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    images: string[];
    description: string;
    is_popular: boolean;
    is_have_wifi: boolean;
    is_have_parking: boolean;
    short_description: string;
    highlight_property: string;
    type: number;
    price: number;

}

const defaultHotelModel = {

    id: 0,
    branch_id: 0,
    name: "",
    email: "",
    address: "",
    phone: "",
    images: [],
    description: "",
    is_popular: false,
    is_have_wifi: false,
    is_have_parking: false,
    short_description: "",
    highlight_property: "",
    type: 0,
    price: 0
}


interface HotelProps {

    currentHotel: Model.Hotel | null;
    branches: Model.Branch[];

    setVisibleCreate: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}

const HotelCreate: React.FC<HotelProps> = ({
    currentHotel,
    setVisibleCreate,
    onSave,
    branches
}) => {
    const [sortKey, setSortKey] = useState(0);

    const [hotelCreate, setHotelCreate] = useState<HotelModel>(defaultHotelModel);

    const [onClickSave, setOnClickSave] = useState(false);

    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);

    const token = getCookie('jwt_token')?.toString();


    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        phone: '',
        address: '',
        area_id: 0,
        type: 0,
        price: 0

    });

    useEffect(() => {
        if (responseAPI?.status != 200) {
            setVisibleError(true);
        } else
            setVisibleError(false);

    }, [responseAPI]);

    useEffect(() => {
        if (currentHotel) {

            setHotelCreate({
                id: currentHotel.id,
                branch_id: currentHotel.branch_id,
                name: currentHotel.name,
                email: currentHotel.email,
                address: currentHotel.address,
                phone: currentHotel.phone,
                images: currentHotel.images,
                description: currentHotel.description,
                is_popular: currentHotel.is_popular,
                is_have_wifi: currentHotel.is_have_wifi,
                is_have_parking: currentHotel.is_have_parking,
                short_description: currentHotel.short_description,
                highlight_property: currentHotel.highlight_property,
                type: currentHotel.type,
                price: currentHotel.price
            });

            setSortKey(currentHotel?.branch_id);

        }
    }, []);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let value = {
            name: hotelCreate?.name,
            email: hotelCreate?.email,
            phone: hotelCreate?.phone,
            address: hotelCreate?.address,
            area_id: sortKey,
            type: hotelCreate?.type,
            price: hotelCreate?.price

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
                address: '',
                area_id: 0,
                type: 0,
                price: 0,
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
        else if (!/^(0\d{9,10})$/.test(data.phone)) {
            newErrors.phone = 'Số điện thoại không đúng định dạng.';
        }

        if (!data.address) {
            newErrors.address = 'Địa chỉ không được để trống.';
        }
        if (data.area_id == 0) {
            newErrors.area_id = 'Vui lòng chọn khu vực.';
        }
        if (data.type == 0) {
            newErrors.type = 'Vui lòng chọn loại hình kinh doanh.';
        }
        if (data.price == 0) {
            newErrors.price = 'Vui lòng nhập giá.';
        }
        return newErrors;
    };


    const handleSave = async () => {

        let value = {
            name: hotelCreate?.name,
            email: hotelCreate?.email,
            phone: hotelCreate?.phone,
            address: hotelCreate?.address,
            area_id: sortKey,
            type: hotelCreate?.type,
            price: hotelCreate.price

        }
        const newErrors = validate({ ...value });
        setErrors(newErrors);
        setOnClickSave(true);

        if (Object.keys(newErrors).length === 0) {
            let data
            if (!currentHotel) {

                data = await handleCreate();
            }
            else {
                data = await handleUpdate();
            }
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

            const response = await fetch(`/api/hotels/create`, {
                method: "POST",
                body: JSON.stringify({
                    branch_id: `${sortKey}`,
                    type: hotelCreate.type,
                    name: hotelCreate.name,
                    phone: hotelCreate?.phone,
                    email: hotelCreate?.email,
                    address: hotelCreate?.address,
                    description: hotelCreate?.description,
                    is_popular: hotelCreate?.is_popular ? 1 : 0,
                    is_have_wifi: hotelCreate?.is_have_wifi ? 1 : 0,
                    is_have_parking: hotelCreate?.is_have_parking ? 1 : 0,
                    short_description: hotelCreate?.short_description,
                    highlight_property: hotelCreate?.highlight_property,
                    price: hotelCreate?.price

                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();


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
    const handleUpdate = async () => {

        try {

            const response = await fetch(`/api/hotels/${currentHotel?.id}/update`, {
                method: "POST",
                body: JSON.stringify({
                    branch_id: `${sortKey}`,
                    type: hotelCreate.type,
                    name: hotelCreate.name,
                    phone: hotelCreate?.phone,
                    email: hotelCreate?.email,
                    address: hotelCreate?.address,
                    description: hotelCreate?.description,
                    is_popular: hotelCreate?.is_popular ? 1 : 0,
                    is_have_wifi: hotelCreate?.is_have_wifi ? 1 : 0,
                    is_have_parking: hotelCreate?.is_have_parking ? 1 : 0,
                    short_description: hotelCreate?.short_description,
                    highlight_property: hotelCreate?.highlight_property,
                    price: hotelCreate?.price

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
                            <InputText id="name" value={hotelCreate?.name} onChange={(e) => setHotelCreate({ ...hotelCreate, name: e.target.value })} type="text" />
                            <label htmlFor="name" >Tên</label>
                        </span>

                    </div>
                    {getFormErrorMessage('name')}

                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputText id="email" type="text" value={hotelCreate.email} onChange={(e) => setHotelCreate({ ...hotelCreate, email: e.target.value })} />
                            <label htmlFor="email">Email</label>

                        </span>

                    </div>

                    {getFormErrorMessage('email')}

                    <div className="field" style={{ marginTop: '1rem' }} >
                        <span className="p-float-label">
                            <InputText id="phone" type="text" value={hotelCreate.phone} onChange={(e) => setHotelCreate({ ...hotelCreate, phone: e.target.value })} />
                            <label htmlFor="phone">Số điện thoại</label>
                        </span>

                    </div>
                    {getFormErrorMessage('phone')}


                    <div className="field" style={{ marginTop: '1rem' }} >
                        <span className="p-float-label">
                            <InputText id="address" type="text" value={hotelCreate.address} onChange={(e) => setHotelCreate({ ...hotelCreate, address: e.target.value })} />
                            <label htmlFor="address">Địa chỉ</label>
                        </span>

                    </div>
                    {getFormErrorMessage('address')}
                    <div>
                        <Dropdown value={sortKey} options={[
                            ...(branches?.map(branch => ({ label: branch.name, value: branch.id })) || [])]}
                        optionLabel="label"
                        onChange={(e) => setSortKey(e.value)}
                        placeholder='Chọn khu vực'
                        className="w-full md:w-14rem"
                        style={{ marginRight: '.5em' }} />
                    </div>
                    {getFormErrorMessage('area_id')}

                    <div >
                        <label htmlFor="horizontal-buttons" className="block mb-2">Giá</label>
                        <InputNumber inputId="horizontal-buttons" value={hotelCreate?.price ?? 0} onValueChange={(e) => setHotelCreate({ ...hotelCreate, price: e.target.value ?? 0 })} showButtons buttonLayout="horizontal" step={100000}
                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                            mode="currency" currency="VND" />
                    </div>
                    {getFormErrorMessage('price')}
                    <div>
                        <label htmlFor="address">Loại hình kinh doanh: </label>
                        <br />
                        <div className=" flex justify-content-center" style={{ marginTop: '0.5rem' }}>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient1" name="pizza" value={1} onChange={(e: RadioButtonChangeEvent) => setHotelCreate({ ...hotelCreate, type: e.value })} checked={hotelCreate.type === 1} />
                                    <label htmlFor="ingredient1" className="ml-2">Khách Sạn</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient2" name="pizza" value={2} onChange={(e: RadioButtonChangeEvent) => setHotelCreate({ ...hotelCreate, type: e.value })} checked={hotelCreate.type === 2} />
                                    <label htmlFor="ingredient2" className="ml-2">Homestay</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient3" name="pizza" value={3} onChange={(e: RadioButtonChangeEvent) => setHotelCreate({ ...hotelCreate, type: e.value })} checked={hotelCreate.type === 3} />
                                    <label htmlFor="ingredient3" className="ml-2">Biệt Thự</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient4" name="pizza" value={4} onChange={(e: RadioButtonChangeEvent) => setHotelCreate({ ...hotelCreate, type: e.value })} checked={hotelCreate.type === 4} />
                                    <label htmlFor="ingredient4" className="ml-2">Khu Nghỉ Dưỡng</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {getFormErrorMessage('type')}

                </div>

                <div className="card p-fluid" style={{ marginTop: '1rem' }}>
                    <div className='check-box-stype' >
                        <div style={{ float: 'left', width: '33.33%' }}>
                            <Checkbox onChange={e => setHotelCreate({ ...hotelCreate, is_have_parking: !hotelCreate.is_have_parking })} checked={hotelCreate.is_have_parking == true}></Checkbox>
                            <label > Bãi đỗ xe </label>
                        </div>
                        <div style={{ float: 'left', width: '33.33%' }}>
                            <Checkbox onChange={e => setHotelCreate({ ...hotelCreate, is_have_wifi: !hotelCreate.is_have_wifi })} checked={hotelCreate.is_have_wifi == true}></Checkbox>
                            <label > Wifi </label>
                        </div>
                        <div style={{ float: 'left', width: '33.33%' }}>
                            <Checkbox onChange={e => setHotelCreate({ ...hotelCreate, is_popular: !hotelCreate.is_popular })} checked={hotelCreate.is_popular == true}></Checkbox>
                            <label > Phổ biến </label>
                        </div>
                        <br></br>
                    </div>
                </div>

                <div className="card p-fluid"  >
                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputTextarea id="description" value={hotelCreate?.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHotelCreate({ ...hotelCreate, description: e.target.value })} rows={5} cols={30} />
                            <label htmlFor="description">Mô tả</label>
                        </span>

                    </div>
                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputTextarea id="short-description" value={hotelCreate?.short_description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHotelCreate({ ...hotelCreate, short_description: e.target.value })} rows={5} cols={30} />
                            <label htmlFor="short-description">Mô tả ngắn</label>
                        </span>
                    </div>
                    <div className="field" style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputTextarea id="highlight_property" value={hotelCreate?.highlight_property} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHotelCreate({ ...hotelCreate, highlight_property: e.target.value })} rows={5} cols={30} />
                            <label htmlFor="highlight_property">Tính năng đặt biệt</label>

                        </span>
                    </div>
                </div>


                <div className='button-save-cancel' style={{ textAlign: 'right' }}>
                    <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                    <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisibleCreate(false); setOnClickSave(false); }} />
                </div>

            </form >

            {responseAPI?.status != 200 ?
                <>

                    <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Lỗi rồi">

                        <CustomErrorPage props={responseAPI} />

                    </Dialog>
                </>
                : null
            }
        </div >
    );
};

export default HotelCreate;


