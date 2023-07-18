import { useEffect, useState } from "react";
import { Model } from "../../../interface";
import { getCookie } from "cookies-next";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CustomErrorPage from "../custom-error";

type FormErrors = {
    hotel_id: number;
    name?: string;
    description?: string;
    bed_number?: number;
    people_number?: number;
    size?: string;
    price?: number;
    quantity?: number;
};
interface Props {

    currentRoom: Model.Room | null;
    hotels: Model.Hotel[];

    setVisibleCreate: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}

interface RoomModel {

    id: number;
    hotel_id: number;
    name: string;
    description: string;
    bed_number: number;
    people_number: number;
    size: string;
    price: number;
    quantity: number;

}

const defaultRoomModel = {

    id: 0,
    hotel_id: 0,
    name: '',
    description: '',
    bed_number: 0,
    people_number: 0,
    size: '',
    price: 0,
    quantity: 0
}

const CreateUpdateRoom: React.FC<Props> = (
    { currentRoom,
        setVisibleCreate,
        onSave,
        hotels }

) => {
    const [room, setRoom] = useState<RoomModel>(defaultRoomModel);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [sortKey, setSortKey] = useState(0);
    const [onClickSave, setOnClickSave] = useState(false);
    const [visibleError, setVisibleError] = useState<boolean>(false);

    const token = getCookie('jwt_token')?.toString();


    const [errors, setErrors] = useState<FormErrors>({
        hotel_id: 0,
        name: '',
        description: '',
        bed_number: 0,
        people_number: 0,
        size: '',
        price: 0,
        quantity: 0

    });


    useEffect(() => {
        if (currentRoom) {

            setRoom({
                id: currentRoom.id,
                hotel_id: currentRoom.hotel_id,
                name: currentRoom.name,
                description: currentRoom.description,
                bed_number: currentRoom.bed_number,
                people_number: currentRoom.people_number,
                size: currentRoom.size,
                price: currentRoom.price,
                quantity: currentRoom.quantity
            });

            setSortKey(currentRoom?.hotel_id);

        }
    }, []);




    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let value = {
            hotel_id: `${sortKey}`,
            name: room.name,
            description: room.description,
            bed_number: room.bed_number,
            people_number: room.people_number,
            size: room.size,
            price: room.price,
            quantity: room.quantity

        }
        const newErrors = validate({ ...value });
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            //gửi api
            // setValues({
            //     value: '',
            //     email: ''
            // });
            setErrors(defaultRoomModel);
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

        if (!data.description) {
            newErrors.description = 'Mô tả không được để trống.';
        }
        if (!data.size) {
            newErrors.size = 'Kích thước không được để trống.';
        }
        if (data.hotel_id == 0) {
            newErrors.hotel_id = 'Vui lòng chọn khách sạn.';
        }
        if (data.bed_number == 0) {
            newErrors.bed_number = 'Vui lòng chọn số giường.';
        }
        if (data.people_number == 0) {
            newErrors.people_number = 'Vui lòng chọn số người.';
        }
        if (data.price == 0) {
            newErrors.price = 'Vui lòng nhập giá phòng.';
        }
        if (data.quantity == 0) {
            newErrors.quantity = 'Vui lòng nhập số lượng.';
        }
        return newErrors;
    };

    const handleSave = async () => {

        let value = {
            hotel_id: `${sortKey}`,
            name: room.name,
            description: room.description,
            bed_number: room.bed_number,
            people_number: room.people_number,
            size: room.size,
            price: room.price,
            quantity: room.quantity

        }
        const newErrors = validate({ ...value });
        setErrors(newErrors);
        setOnClickSave(true);

        if (Object.keys(newErrors).length === 0) {
            let data
            if (!currentRoom) {

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

            const response = await fetch(`/api/rooms/create`, {
                method: "POST",
                body: JSON.stringify({
                    hotel_id: `${sortKey}`,
                    name: room.name,
                    description: room.description,
                    bed_number: room.bed_number,
                    people_number: room.people_number,
                    size: room.size,
                    price: room.price,
                    quantity: room.quantity

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
    const handleUpdate = async () => {

        try {

            const response = await fetch(`/api/rooms/${room?.id}/update`, {
                method: "POST",
                body: JSON.stringify({
                    hotel_id: `${sortKey}`,
                    name: room.name,
                    description: room.description,
                    bed_number: room.bed_number,
                    people_number: room.people_number,
                    size: room.size,
                    price: room.price,
                    quantity: room.quantity
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
            <form onSubmit={(e) => { handleSubmit(e) }} >

                <div className="card p-fluid" >


                    <div className="field" style={{ marginTop: '1rem' }}>

                        <span className="p-float-label">
                            <InputText id="name" value={room?.name} onChange={(e) => setRoom({ ...room, name: e.target.value })} type="text" />
                            <label htmlFor="name" >Tên</label>
                        </span>

                    </div>
                    {getFormErrorMessage('name')}
                    <div>
                        <Dropdown value={sortKey} options={[
                            ...(hotels?.map(hotel => ({ label: hotel.name, value: hotel.id })) || [])]}
                            optionLabel="label"
                            onChange={(e) => setSortKey(e.value)}
                            placeholder='Chọn khách sạn'
                            className="w-full md:w-14rem"
                            style={{ marginRight: '.5em' }} />
                    </div>
                    {getFormErrorMessage('hotel_id')}



                    <div className="field" style={{ marginTop: '1rem' }}>

                        <span className="p-float-label">
                            <InputText id="size" value={room?.size} onChange={(e) => setRoom({ ...room, size: e.target.value })} type="text" />
                            <label htmlFor="size" >Kích thước</label>
                        </span>

                    </div>
                    {getFormErrorMessage('size')}

                    <div className="field " style={{ marginTop: '1rem' }}>
                        <span className="p-float-label">
                            <InputTextarea id="description" value={room?.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRoom({ ...room, description: e.target.value })} rows={5} cols={30} />
                            <label htmlFor="description">Mô tả</label>

                        </span>
                    </div>
                    {getFormErrorMessage('description')}


                    <div className="flex-auto">
                        <label htmlFor="minmax-buttons" className=" block mb-2">Số giường</label>
                        <InputNumber inputId="minmax-buttons" value={room?.bed_number ?? 0} onValueChange={(e) => setRoom({ ...room, bed_number: e.target.value ?? 0 })} mode="decimal" showButtons min={0} max={10} />
                    </div>
                    {getFormErrorMessage('bed_number')}


                    <div className="flex-auto">
                        <label htmlFor="minmax-buttons" className=" block mb-2">Số người</label>
                        <InputNumber inputId="minmax-buttons" value={room?.people_number ?? 0} onValueChange={(e) => setRoom({ ...room, people_number: e.target.value ?? 0 })} mode="decimal" showButtons min={0} max={10} />
                    </div>
                    {getFormErrorMessage('people_number')}

                    <div className="flex-auto">
                        <label htmlFor="minmax-buttons" className=" block mb-2">Số lượng phòng</label>
                        <InputNumber inputId="minmax-buttons" value={room?.quantity ?? 0} onValueChange={(e) => setRoom({ ...room, quantity: e.target.value ?? 0 })} mode="decimal" showButtons min={0} max={10} />
                    </div>
                    {getFormErrorMessage('quantity')}

                    <div className="flex-auto">
                        <label htmlFor="horizontal-buttons" className="block mb-2">Giá</label>
                        <InputNumber inputId="horizontal-buttons" value={room?.price ?? 0} onValueChange={(e) => setRoom({ ...room, price: e.target.value ?? 0 })} showButtons buttonLayout="horizontal" step={100000}
                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                            mode="currency" currency="VND" />
                    </div>
                    {getFormErrorMessage('price')}
                </div>

                <div className='button-save-cancel' style={{ textAlign: 'right' }}>
                    <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleSave()} />
                    <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisibleCreate(false); setOnClickSave(false); }} />
                </div>

                {responseAPI?.status != 200 ?
                    <>

                        <Dialog visible={visibleError} maximizable onHide={() => setVisibleError(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} header="Lỗi rồi">

                            <CustomErrorPage props={responseAPI} />

                        </Dialog>
                    </>
                    : null
                }

            </form>
        </>
    )
}

export default CreateUpdateRoom;