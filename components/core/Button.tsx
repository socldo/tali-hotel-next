import React, {memo} from 'react'

interface Props {
    text: String
    textColor?: String
    bgColor?: String
    fullWidth?: boolean
    IcAfter?: any

}

const Button = ({text, textColor, bgColor, IcAfter, fullWidth}: Props) => {
    return (
        <div className="w-full"   >
            <a href="#_" className={`${bgColor || "bg-blue-800"} mt-4 w-full inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} data-rounded="rounded-md" data-primary="blue-600" data-primary-reset="{}">
                {text}
            </a>

        </div>
    )
}

export default memo(Button)
