/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AdminFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer" style={{ 'margin': '0 50px', 'justifyContent': 'center' }}>

            <i className="pi pi-facebook" style={{ fontSize: '2.5rem' }}></i>

            <i className="pi pi-telegram" style={{ fontSize: '2.5rem' }}></i>

            <i className="pi pi-twitter" style={{ fontSize: '2.5rem' }}></i>

            <i className="pi pi-youtube" style={{ fontSize: '2.5rem' }}></i>

        </div>
    );
};

export default AdminFooter;
