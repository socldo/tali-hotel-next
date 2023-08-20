import React, { useEffect, useRef, useState } from 'react';
import { Controller, FieldErrorsImpl, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import image from 'next/image';
import { Image } from 'primereact/image';
import { getCookie } from 'cookies-next';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { Layout } from '../../components/layout';

interface ToastRef {
    show: (args: any) => void;
}

const numberFormat = (e: any) =>
    new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    }).format(e);


const Explore = () => {

    const toast = useRef<ToastRef | null | Toast>(null);

    const [value, setValue] = useState('');
    const [branches, setBranches] = useState([]);
    const [keySearch, setKeySearch] = useState('');

    async function getBranches() {

        let token = getCookie('jwt_token')?.toString();

        let url = `/api/branches?key_search=${value}`;

        console.log(url);


        const response: Response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: token == undefined ? "" : token
            }),
        });
        const data = await response.json();

        return data.data
    }

    useEffect(() => {
        getBranches()
            .then(result => {
                setBranches(result);
            })
    }, [value]);

    const show = () => {
        toast.current ? toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: getValues('value') }) : null;
    };

    const defaultValues = {
        value: ''
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({ defaultValues });

    const onSubmit = (data: any) => {
        data.value && show();

        reset();
    };

    type FormErrors = Partial<FieldErrorsImpl<{ value: string; }>>;


    const getFormErrorMessage = (name: keyof FormErrors) => {
        return errors[name]?.message ? (
            <small className="p-error">{errors[name]?.message}</small>
        ) : (
            <small className="p-error">&nbsp;</small>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];


    const productTemplate = (product: any) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3">
                    <img src={product.images} alt={product.name} className="w-full shadow-2" />
                </div>
                <div>
                    <h4 className="mb-1 text-xl">{product.name}</h4>
                    <h3 className="mb-1">{product.address}</h3>
                </div>
            </div>
        );
    };

    const changeKeySearch = (value: any) => {
        setKeySearch(value.target.value)
    }
    return (

        <>
            <Layout
                metadata={{
                    title: `Hoạt động`,
                    description: ""
                }}
            >

                <div className="background-container text-center">
                    <div className="background-image">
                        <img src="/explore-beach.jpeg" alt="Background" />
                    </div>
                    <div className="absolute inset-0 inset-y-40 md:mx-auto mt-16 mb-16 flex flex-col w-1/4 gap-4">
                        <p className='text-white text-xl font-medium'>Tìm cuộc phiêu lưu tiếp theo của quý khách</p>
                        <span className="p-input-icon-left p-float-label">
                            <i className="pi pi-search" />
                            <InputText className='w-full rounded-lg' id="branch" value={value} onChange={(e) => setValue(e.target.value)} />
                            <label htmlFor="branch">Tìm kiếm địa điểm</label>
                        </span>

                        <Button onChange={(e) => changeKeySearch(e)} className='' label="Tìm kiếm" raised />

                    </div>
                    <div className="absolute inset-0 inset-y-80 md:mx-auto mt-16 mb-16 flex flex-col gap-4 card  w-1/2">
                        <Carousel value={branches} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                            autoplayInterval={3000} itemTemplate={productTemplate} />
                    </div>
                </div>
            </Layout >
        </>
    );
}
export default Explore;