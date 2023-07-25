import { Dialog } from "primereact/dialog";
import { Model } from "../../../interface";
import CustomErrorPage from "../custom-error";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { InputText } from "primereact/inputtext";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import TemplateUploadImages from "../../core/TemplateUploadImages";


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

    const [errors, setErrors] = useState<FormErrors>({
        title: '',
        image: '',
        summary: '',
        content: '',
        type: 0

    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let value = {
            title: newsCreateUpdate?.title,
            image: newsCreateUpdate?.image,
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
            newErrors.name = 'Tiêu đề không được để trống.';
        }
        if (!data.image) {
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

            const response = await fetch(`/api/news/create`, {
                method: "POST",
                body: JSON.stringify({
                    title: newsCreateUpdate.title,
                    image: newsCreateUpdate.image,
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

            const response = await fetch(`/api/news/${currentNews?.id}/update`, {
                method: "POST",
                body: JSON.stringify({
                    title: newsCreateUpdate.title,
                    image: newsCreateUpdate.image,
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
                            <InputText id="summary" value={newsCreateUpdate?.title} onChange={(e) => setNewsCreateUpdate({ ...newsCreateUpdate, summary: e.target.value })} type="text" />
                            <label htmlFor="summary" >Tóm tắt</label>
                        </span>

                    </div>
                    {getFormErrorMessage('summary')}

                    <div className="field" style={{ marginTop: '1rem' }}>

                        <Editor value={newsCreateUpdate.content} onTextChange={(e: EditorTextChangeEvent) => setNewsCreateUpdate({ ...newsCreateUpdate, content: e.htmlValue ? e.htmlValue : "" })} style={{ height: '320px' }} />

                    </div>
                    {getFormErrorMessage('content')}


                    <div >
                        <TemplateUploadImages onSelectedFiles={(e) => handleSelectedFiles(e)}  ></TemplateUploadImages>
                        <br />
                    </div>
                </div>
            </form>

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