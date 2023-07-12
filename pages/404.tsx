import React from 'react';
import { Page } from '../types/types';
import { useRouter } from 'next/router';
import 'primeicons/primeicons.css';
import Link from 'next/link';
const Custom404Page: Page = () => {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <div className='flex items-center justify-center w-full min-h-[70vh] text-gray-900 my-12 px-4'>
            <div className='flex flex-col items-center w-full gap-8'>
                <h1 className='text-9xl md:text-16xl w-full select-none text-center font-black text-gray-400'>
                    404
                </h1>
                <p className='text-3xl font-semibold text-center'>Không tìm thấy trang! {'\uD83D\uDE1E'}</p>
                <p className='text-2xl md:px-12 text-center'>
                    Vui lòng kiểm tra đường dẫn trang web của bạn
                </p>
                <div className='flex flex-row justify-between gap-8'>
                    <div >
                        <a
                            href="#"
                            onClick={() => goBack()}
                            className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-indigo-500 hover:bg-indigo-500 hover:text-white'>
                            Trang trước
                            <i className="pi pi-arrow-circle-left" style={{ paddingLeft: '10px', color: 'var(--primary-color)' }}></i>
                        </a>

                    </div>

                    <Link
                        href="/"
                        className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-green-500 hover:bg-green-500 hover:text-white'>
                        Trang chủ
                        <i className="pi pi-home" style={{ paddingLeft: '10px', color: 'var(--primary-color)' }}></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

Custom404Page.getLayout = function getLayout(page) {
    return page;
};

export default Custom404Page;
