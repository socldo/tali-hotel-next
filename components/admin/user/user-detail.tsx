import { Avatar } from 'primereact/avatar';
import React, { useEffect, useRef, useState } from 'react';
import { getGenderName, getRoleName } from '../../../utils/enum';
import { Model } from '../../../interface';

interface UserDetailProps {

    user: Model.User | null;
}

const UserDetail: React.FC<UserDetailProps> = ({
    user
}) => {


    if (!user) {
        return null; // Xử lý trường hợp user là null
    }
    return (<>
        <div className="card p-fluid"  >
            <div className="field" style={{ textAlign: 'center' }}>
                <Avatar image={user.avatar} shape="circle" size="xlarge" />

            </div>
            <div className="field">
                <label htmlFor="role" style={{ fontWeight: 'bold' }} >Bộ phận: </label>
                <span>{getRoleName(user?.role_id)}</span>
            </div>
            <div className="field">
                <label style={{ fontWeight: 'bold' }}>Tên: </label>
                <span>{user?.name}</span>
            </div>
            <div className="field">
                <label style={{ fontWeight: 'bold' }}>Sinh Nhật: </label>
                <span>{user?.birthday}</span>
            </div>


            <div className="field">
                <label style={{ fontWeight: 'bold' }}>Giới tính: </label>
                <span>{getGenderName(user?.gender)}</span>
            </div>
            <div className="field">
                <label style={{ fontWeight: 'bold' }}>Số điện thoại: </label>
                <span>{user?.phone}</span>
            </div>
            <div className="field">
                <label style={{ fontWeight: 'bold' }}>Email: </label>
                <span>{user?.email}</span>
            </div>
            <div className="field" >
                <label style={{ fontWeight: 'bold' }}>Ngày đăng ký: </label>
                <span>{user?.created_at}</span>
            </div>
        </div>
    </>
    );
};



export default UserDetail;