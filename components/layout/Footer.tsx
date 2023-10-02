
import Link from 'next/link'
import React from 'react'

const Footer = () => {

    return <footer className="bg-gray-100 dark:bg-gray-900 mt-auto">
        <div
            className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24"
        >

            <div className="lg:flex lg:items-end lg:justify-between">
                <div>
                    <div
                        className="flex justify-center text-teal-600 dark:text-teal-300 lg:justify-start"
                    >

                        <Link href="/">
                            <span className="self-center text-3xl font-semibold whitespace-nowrap text-white"><img className='h-12' src="/tali-hotel-logo-black.png" alt="" /></span>
                        </Link>

                    </div>

                    <p
                        className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 dark:text-gray-400 lg:text-left"
                    >
                        Hãy chia sẽ cho chúng tôi ý kiến của bạn. Chúng tôi luôn luôn lắng nghe bạn ...
                    </p>
                </div>

                <ul
                    className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12"
                >
                    <li>
                        <a
                            className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                            href="/contact"
                        >
                            About
                        </a>
                    </li>


                    <li>
                        <a
                            className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                            href="/blog"
                        >
                            Blog
                        </a>
                    </li>
                </ul>
            </div>

            <p
                className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 lg:text-right"
            >
                Copyright &copy; 2023.
            </p>
        </div>
    </footer>
}

export default Footer
