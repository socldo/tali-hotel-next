/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '../../types/types';
import { LayoutContext } from './context/layoutcontext';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { AiOutlineUser, VscSignOut } from '../../utils/icons';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const router = useRouter()


    const [isUserIconHovered, setUserIconHovered] = useState(false);
    const [isTextHovered, setTextIconHovered] = useState(false);

    const handleUserIconMouseEnter = () => {
        setUserIconHovered(true);
    };

    const handleUserIconMouseLeave = () => {
        setUserIconHovered(false);
    };

    const handleTextMouseEnter = () => {
        setTextIconHovered(true);
    };

    const handleTextIconMouseLeave = () => {
        setTextIconHovered(false);
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleLogout = async () => {
        deleteCookie("id");
        deleteCookie("jwt_token");
        deleteCookie("email");
        deleteCookie("phone");
        deleteCookie("name");
        deleteCookie("role");
        deleteCookie("avatar");
        await router.push('/auth')
    }

    const handleUpdateUser = async () => {

        await router.push('/user')
        window.location.reload();

    }

    const redirectTo = (url: any) => {
        window.location.href = url;
    };

    return (
        <div className="layout-topbar">
            <div style={{ 'marginRight': '1rem' }}>
                <Link href="/admin" className="layout-topbar-logo">
                    <img src="/tali-hotel-logo-black.png" alt="logo" />
                </Link>
            </div>
            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                onMouseEnter={handleUserIconMouseEnter}
                onMouseLeave={handleUserIconMouseLeave}
                ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
            </div>
            {isUserIconHovered && (
                <div
                    onMouseEnter={handleUserIconMouseEnter}
                    onMouseLeave={handleUserIconMouseLeave}
                >

                    <ul className="absolute right-0 mt-2 bg-white border shadow" style={{ 'marginTop': '1rem' }}>
                        <li
                            className="font-semibold bg-white hover:bg-gray-300 block whitespace-no-wrap"
                            onClick={() => handleUpdateUser()}
                        >
                            <div className="flex items-center py-2 px-4 gap-x-2.5 cursor-pointer">
                                <AiOutlineUser />
                                <span>&nbsp;Tài Khoản</span>
                            </div>
                        </li>

                        <li
                            className="bg-white hover:bg-gray-300 block whitespace-no-wrap"
                            onClick={() => handleLogout()}
                        >
                            <div className="flex items-center py-2 px-4 gap-x-2.5 cursor-pointer">
                                <VscSignOut />
                                <span>&nbsp;Đăng xuất</span>
                            </div>
                        </li>
                    </ul>
                </div>

            )}
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
