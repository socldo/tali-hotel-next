import { Dialog } from "primereact/dialog";
import { Model } from "../../../interface";
import CustomErrorPage from "../custom-error";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { InputText } from "primereact/inputtext";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import TemplateUploadImages from "../../core/TemplateUploadImages";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';


type FormErrors = {
    title?: string;
    image?: string;
    summary?: string;
    content?: string;
    type: number;
};
interface NewsModel {

    id: number;
    title: string;
    image: string;
    summary: string;
    content: string;
    type: number;

}
interface Props {

    currentNews: Model.News | null;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;

}
const NewsCreateUpdate: React.FC<Props> = ({
    currentNews,
    setVisible,
    onSave
}) => {

    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [newsCreateUpdate, setNewsCreateUpdate] = useState<NewsModel>({ id: 0, title: '', image: '', summary: '', content: '', type: 0 });
    const [onClickSave, setOnClickSave] = useState(false);
    const token = getCookie('jwt_token')?.toString();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [text, setText] = useState<string>('');

    const [errors, setErrors] = useState<FormErrors>({
        title: '',
        image: '',
        summary: '',
        content: '',
        type: 0

    });

    useEffect(() => {

        setNewsCreateUpdate({ ...newsCreateUpdate, content: text })
    }, [text]);
    useEffect(() => {
        if (currentNews) {

            setNewsCreateUpdate({
                id: currentNews.id,
                title: currentNews.title,
                content: currentNews.content,
                image: currentNews.image,
                summary: currentNews.summary,
                type: currentNews.type
            });
            setText(currentNews.content)

        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let value = {
            title: newsCreateUpdate?.title,
            image: selectedFiles,
            summary: newsCreateUpdate?.summary,
            content: newsCreateUpdate?.content,
            type: newsCreateUpdate?.type

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
                title: '',
                image: '',
                summary: '',
                content: '',
                type: 0
            });
        }

    };

    const validate = (data: any) => {
        let newErrors: any = {};

        if (!data.title) {
            newErrors.title = 'Tiêu đề không được để trống.';
        }

        if (selectedFiles.length <= 0 && !newsCreateUpdate.id) {
            newErrors.image = 'Hình ảnh không được để trống.';
        }
        if (!data.summary) {
            newErrors.summary = 'Tóm tắt không được để trống.';
        }
        if (data.type == 0) {
            newErrors.type = 'Vui lòng chọn loại tin tức.';
        }
        if (!data.content) {
            newErrors.content = 'Vui lòng nhập nội dung.';
        }
        return newErrors;
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

    const handleCreate = async () => {

        try {
            let downloadURL = await handleImageUpload(selectedFiles[0]);


            const response = await fetch(`/api/news/create`, {
                method: "POST",
                body: JSON.stringify({
                    title: newsCreateUpdate.title,
                    image: downloadURL,
                    summary: newsCreateUpdate.summary,
                    content: newsCreateUpdate.content,
                    type: newsCreateUpdate.type
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

            let downloadURL = await handleImageUpload(selectedFiles[0]);

            if (!downloadURL && newsCreateUpdate.id != 0) {

                downloadURL = newsCreateUpdate?.image
            }


            const response = await fetch(`/api/news/${currentNews?.id}/update`, {
                method: "POST",
                body: JSON.stringify({
                    title: newsCreateUpdate.title,
                    image: downloadURL,
                    summary: newsCreateUpdate.summary,
                    content: newsCreateUpdate.content,
                    type: newsCreateUpdate.type

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

            const storageRef = ref(storage, `news/${newFileName}`);
            const uploadTask = uploadBytesResumable(storageRef, images);

            try {
                const snapshot = await uploadTask;
                return await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.log('Lỗi khi tải lên hình ảnh:', error);
            }
        }
    };

    const handleSave = async () => {


        let value = {
            title: newsCreateUpdate?.title,
            image: selectedFiles,
            summary: newsCreateUpdate?.summary,
            content: newsCreateUpdate?.content,
            type: newsCreateUpdate?.type

        }
        const newErrors = validate({ ...value });
        setErrors(newErrors);
        setOnClickSave(true);

        if (Object.keys(newErrors).length === 0) {
            let data

            if (!currentNews) {

                data = await handleCreate();

            }
            else {

                data = await handleUpdate();
            }

            if (data?.status == 200) {
                setVisible(false);
                onSave();
            } else {

                setVisibleError(true);
            }
        }

    }

    return (
        <>
            <form onSubmit={(e) => { handleSubmit(e) }} >

                <div className="card p-fluid" >

                    <div className="field" style={{ marginTop: '1rem' }}>

                        <span className="p-float-label">
                            <InputText id="title" value={newsCreateUpdate?.title} onChange={(e) => setNewsCreateUpdate({ ...newsCreateUpdate, title: e.target.value })} type="text" />
                            <label htmlFor="title" >Tiêu đề</label>
                        </span>

                    </div>
                    {getFormErrorMessage('title')}

                    <div className="field" style={{ marginTop: '1rem' }}>

                        <span className="p-float-label">
                            <InputText id="summary" value={newsCreateUpdate?.summary} onChange={(e) => setNewsCreateUpdate({ ...newsCreateUpdate, summary: e.target.value })} type="text" />
                            <label htmlFor="summary" >Tóm tắt</label>
                        </span>

                    </div>
                    {getFormErrorMessage('summary')}


                    <div>
                        <label htmlFor="type">Phân loại: </label>
                        <br />
                        <div className=" flex justify-content-center" style={{ marginTop: '0.5rem' }}>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient1" name="pizza" value={1} onChange={(e: RadioButtonChangeEvent) => setNewsCreateUpdate({ ...newsCreateUpdate, type: e.value })} checked={newsCreateUpdate.type === 1} />
                                    <label htmlFor="ingredient1" className="ml-2">Khách Sạn</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient2" name="pizza" value={2} onChange={(e: RadioButtonChangeEvent) => setNewsCreateUpdate({ ...newsCreateUpdate, type: e.value })} checked={newsCreateUpdate.type === 2} />
                                    <label htmlFor="ingredient2" className="ml-2">Du lịch</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="ingredient3" name="pizza" value={3} onChange={(e: RadioButtonChangeEvent) => setNewsCreateUpdate({ ...newsCreateUpdate, type: e.value })} checked={newsCreateUpdate.type === 3} />
                                    <label htmlFor="ingredient3" className="ml-2">Kinh nghiệm và lời khuyên</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {getFormErrorMessage('type')}


                </div>
            </form>
            <div className="field" style={{ marginTop: '1rem' }}>

                <Editor value={text} onTextChange={(e: EditorTextChangeEvent) => setText(!e.htmlValue ? "" : e.htmlValue)} style={{ height: '320px' }} />

            </div>
            {getFormErrorMessage('content')}

            <div >
                <TemplateUploadImages onSelectedFiles={(e) => handleSelectedFiles(e)}  ></TemplateUploadImages>
                {!newsCreateUpdate.id ? getFormErrorMessage('image') : null}
                <br />
            </div>


            <div className='button-save-cancel' style={{ textAlign: 'right' }}>
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

        </>
    )
}

export default NewsCreateUpdate;