import React, {memo} from 'react'

interface Props {
    text: String
    textColor?: String
    bgColor?: String
    focusHandle?: String

}


const ButtonNext = ({text, textColor, bgColor, focusHandle}: Props) => {
    return (
        <div className="w-full"   >
            <a href="#_" className={`${bgColor || "bg-blue-500"} ${textColor || "text-white"} ${focusHandle || ""} drop-shadow-md focus:ring-blue-500 mt-2 w-full inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none border-1`} data-rounded="rounded-md" data-primary="blue-600" data-primary-reset="{}">
                {text} &nbsp; <i className="pi pi-arrow-right" style={{ color: 'white' }}></i>
            </a>

        </div>
    )
}

export default memo(ButtonNext)
