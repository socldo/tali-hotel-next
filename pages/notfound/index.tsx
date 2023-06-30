/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { Page } from '../../types/types';
import { useRouter } from 'next/router';

const NotFoundPage: Page = () => {

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
                <p className='text-3xl font-semibold text-center'>You have discovered a secret place</p>
                <p className='text-2xl md:px-12 text-center'>
                    Unfortunately, this is only a 404 page. You may have
                    mistyped the address, or the page has been moved to another URL.
                </p>
                <div className='flex flex-row justify-between gap-8'>
                    <a href="#"
                        onClick={() => goBack()}
                        className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-indigo-500 hover:bg-indigo-500 hover:text-white'>
                        Previous Page
                    </a>
                    <a href="/"
                        className='flex justiy-center items-center px-5 py-2 text-xl rounded-md text-black border border-green-500 hover:bg-green-500 hover:text-white'>
                        Home Page
                    </a>
                </div>
            </div>
        </div>
    );
};

NotFoundPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default NotFoundPage;
