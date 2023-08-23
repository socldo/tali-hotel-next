/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AdminMenuItem from './AdminMenuItem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const redirectTo = (url: any) => {
        window.location.href = url;
    };

    const model: AppMenuItem[] = [
        {
            label: 'Trang chủ',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-android', to: '/admin' },
                { label: 'Trang chủ', icon: 'pi pi-fw pi-home', command: () => redirectTo('/') }

            ]
        },
        {
            label: 'Quản lý',
            items: [
                { label: 'Khu Vực', icon: 'pi pi-fw pi-globe', to: '/admin/branches' },
                { label: 'Khách Sạn', icon: 'pi pi-fw pi-building', to: '/admin/hotels' },
                { label: 'Phòng', icon: 'pi pi-fw pi-calendar-times', to: '/admin/rooms' },
                { label: 'Tài Khoản', icon: 'pi pi-fw pi-users', to: '/admin/users' },

                { label: 'Đánh giá', icon: 'pi pi-fw pi-star', to: '/admin/reviews' },
                { label: 'Tin tức', icon: 'pi pi-fw pi-book', to: '/admin/news' },
                { label: 'Booking', icon: 'pi pi-fw pi-ticket', to: '/admin/booking' }
            ]
        },
        {
            label: 'Báo cáo',
            items: [
                { label: 'Khu vực', icon: 'pi pi-fw pi-globe', to: '/admin/reports/areas' },
                { label: 'Khách sạn', icon: 'pi pi-fw pi-building', to: '/admin/reports/hotels' }
            ]
        }


    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AdminMenuItem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="http://localhost:3000/admin" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Tali-Hotel" className="w-full mt-3" src='/tali-hotel-logo-black.png' style={{ maxWidth: '120px' }} />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
