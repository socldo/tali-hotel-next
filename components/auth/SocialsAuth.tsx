import React from 'react'
import { FaFacebookF, FaGoogle } from '../../utils/icons'
import Link from 'next/link'
import GGlogin from '../googlelogin'

const SocialsAuth = () => {
    return (
        <div className="flex justify-center my-2">
            <Link
                href="/googlelogin"
                // className="border-2 border-gray-200 rounded-full p-3 mx-1 transition-all hover:bg-blue-400 hover:text-white"
            >
                <GGlogin></GGlogin>
            </Link>
        </div>
    )
}

export default SocialsAuth
