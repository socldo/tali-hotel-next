import React from 'react';
import 'primeicons/primeicons.css';




interface Props {
    props: Model.APIResponse;
}
const CustomErrorPage = (props: Props) => {

    return (
        <div className='flex items-center justify-center w-full min-h-[50vh] text-gray-900 my-12 px-4'>
            <div className='flex flex-col items-center w-full gap-8'>
                <h1 className='text-6xl md:text-16xl w-full select-none text-center font-black text-gray-400'>
                    Lỗi rồi{'\u2757'}

                </h1>
                <p className='text-2xl font-semibold text-center'>{props.props.message}</p>

            </div>
        </div>
    );
};

export default CustomErrorPage;
