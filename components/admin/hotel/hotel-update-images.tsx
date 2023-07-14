import { useEffect, useState } from "react";
import { Model } from "../../../interface";
import ShowAndUpdateImages from "../galleria";
import { Button } from 'primereact/button';
import { getCookie } from "cookies-next";
import { Dialog } from "primereact/dialog";
import CustomErrorPage from "../custom-error";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, analytics } from '../../../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import TemplateUploadImages from "../../core/TemplateUploadImages";


interface Props {

    hotel: Model.Hotel | null;
    setVisibleImages: (value: boolean) => void;
    propChange: () => void;

}
const HotelUpdateImages: React.FC<Props> = ({
    hotel,
    setVisibleImages,
    propChange
}) => {
    const [hotelImages, setHotelImages] = useState<string[]>([]);
    const [hotelUpdateImages, setHotelUpdateImages] = useState<string[]>([]);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [visibleType, setVisibleType] = useState(0);


    const token = getCookie('jwt_token')?.toString();

    useEffect(() => {

        setHotelImages((hotel?.images ?? []).map(image => image));


    }, [hotel]);


    const handleupdateImage = (imageUpdate: string[]) => {
        setHotelUpdateImages(imageUpdate);
    }

    const onSave = () => {

        let isEqua = hotelImages.length === hotelUpdateImages.length && hotelUpdateImages.every((item, index) => item === hotelUpdateImages[index])

        if (!isEqua) {
            handleUpdateImages(hotelUpdateImages)
        }

        setVisibleImages(false);

    }
    const addImages = async () => {

        let addNewImages = await handleImageUpload(selectedFiles);
        const mergedList = [...hotelUpdateImages, ...addNewImages];
        const filteredList = mergedList.filter((image): image is string => typeof image === 'string');

        handleUpdateImages(filteredList);

        setVisibleImages(false);

    }


    const handleUpdateImages = async (images: string[]) => {

        try {

            const response = await fetch(`/api/hotels/${hotel?.id}/update-images`, {
                method: "POST",
                body: JSON.stringify({
                    images: images
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log('data:', data);


            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

            if (data.status == 200) {

                propChange();
            }
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    const handleSelectedFiles = async (files: File[]) => {
        setSelectedFiles(files);

    };


    const handleImageUpload = async (images: File[]) => {
        const uploadPromises = images.map(async (image) => {
            const fileExtension = image.name.split('.').pop();
            const newFileName = `${uuidv4()}.${fileExtension}`;

            const storageRef = ref(storage, `hotels/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            try {
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);
                return downloadURL;
            } catch (error) {
                console.log('Lỗi khi tải lên hình ảnh:', error);
                return null;
            }
        });

        try {
            const uploadResults = await Promise.all(uploadPromises);
            return uploadResults.filter((result) => result !== null);
        } catch (error) {
            console.log('Lỗi khi tải lên nhiều hình ảnh:', error);
            return [];
        }
    };


    return (
        <>
            {visibleType == 0 ?
                <>
                    <div>
                        <ShowAndUpdateImages listImageUpdate={handleupdateImage} hotelImages={hotelImages} />
                    </div>

                    <div className='button-save-cancel' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Button onClick={() => setVisibleType(1)} label="Thêm ảnh" severity="help" type="submit" icon="pi pi-images" style={{ marginRight: '.5em' }} />

                        </div>
                        <div>
                            <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={onSave} />
                            <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => setVisibleImages(false)} />
                        </div>
                    </div>
                </>
                :
                <>
                    <div >
                        <TemplateUploadImages onSelectedFiles={handleSelectedFiles}  ></TemplateUploadImages>
                        <br />


                        <div className='button-save-cancel' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Button onClick={() => setVisibleType(0)} label="Trở về" severity="help" type="submit" icon="pi pi-arrow-left" style={{ marginRight: '.5em' }} />

                            </div>
                            <div>
                                <Button onClick={() => addImages()} label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} />
                                <Button onClick={() => setVisibleImages(false)} label="Hủy" severity="danger" icon="pi pi-times" />
                            </div>
                        </div>
                    </div >
                </>
            }
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
export default HotelUpdateImages;