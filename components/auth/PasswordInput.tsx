import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FieldError } from 'react-hook-form';
interface PasswordInputProps {
    label: string;
    id: string;
    errors: FieldError | undefined;
    register: any; // Hoặc kiểu dữ liệu chính xác của đối tượng register nếu có
}

function PasswordInput({
    label,
    id,
    errors,
    register,
}: PasswordInputProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-2.5 w-full">
            <label
                htmlFor={id}
                className={`block font-bold text-sm mb-1 ${errors ? 'text-red-400' : 'text-primary'
                    }`}
            >
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    className={`block rounded-xl w-full bg-transparent outline-none border-b-2 py-2 px-4 ${errors ? 'text-red-300 border-red-400' : 'text-primary'
                        }`}
                    {...register}
                />
                <button
                    type="button"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2"
                    onClick={handleTogglePassword}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            {errors && (
                <p className="text-red-500 text-sm mt-1">
                    {errors && errors.type === 'password' ? 'Mật khẩu không hợp lệ' : 'Mật khẩu không khớp'}
                </p>
            )}
        </div>
    );
}

export default PasswordInput;
