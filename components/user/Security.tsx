import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { deleteCookie, getCookie } from 'cookies-next'
import { Model } from '../../interface'
import { setTimeout } from 'timers'

const Security = () => {
    const router = useRouter()
    const id = getCookie('id');
    const token = getCookie('jwt_token')?.toString();
    const username = getCookie('phone')?.toString();
    const [renderCount, setRenderCount] = useState(0);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    // Delete Account
    const handleDeleteMyAccount = async () => {
        try {
            const result = handleChangeStatus();
            // const result = await deleteUser(user?.id as unknown as string).unwrap()
            toast.success('Delete success')
            deleteCookie("jwt_token");
            deleteCookie("email");
            deleteCookie("phone");
            deleteCookie("name");
            deleteCookie("role");
            deleteCookie("jwtavatartoken");
            // Fix error toast
            setTimeout(() => router.push('/'), 1)
        } catch (error: any) {
            toast.error(error.data?.message || 'Something went wrong')
        }
    }

    // Change Password  
    const formSchema = yup.object().shape({
        password: yup.string()
            .required('Password is required'),
        newPassword: yup.string()
            .required('New password is required')
            .min(6, 'Password length should be at least 6 characters')
            .notOneOf([yup.ref('password')], 'New password must be not match current password')
    })
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(formSchema)
    })
    const passwordRef = useRef<HTMLDivElement>(null)


    const handleChangeStatus = async () => {

        try {

            const response = await fetch(`/api/users/${id}/change-status`, {
                method: "POST",
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,

                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log('data:', data);


            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

            if (data.status == 200) {

                setRenderCount(renderCount + 1);
            }
            return data;
        } catch (error) {
            toast.success("Cập nhật thất bại!");
            console.error('Error fetching:', error);
        }
    };
    const handleChangePasswords = async () => {

        try {

            const response = await fetch(`/api/users/${id}/change-password?old_password=${oldPassword}&new_password=${newPassword}`, {
                method: "POST",
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    username: username
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });
            const data = await response.json();
            console.log('data:', data);


            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

            if (data.status == 200) {

                deleteCookie("jwt_token");
                deleteCookie("email");
                deleteCookie("phone");
                deleteCookie("name");
                deleteCookie("role");
                deleteCookie("avatar");
                setRenderCount(renderCount + 1);
                toast.success("Cập nhật thành công, vui lòng đăng nhập lại!");
                setTimeout(() => {
                    router.push('/auth')
                }, 3000)
            } else {
                toast.warning(data.message);
            }
            return data;
        } catch (error) {
            console.error('Error fetching:', error);
        }
    };

    return (
        <div>
            aaa
            <div>
                <h1 className="font-bold text-2xl ">Bảo mật tài khoản</h1>
                <h2 className='mt-1 mb-1'>Điều chỉnh cài đặt bảo mật của bạn và thiết lập xác thực hai yếu tố.</h2>
            </div>
            <div className="mt-2.5 flex flex-col text-sm">
                {/* Password */}
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full ">
                    <span className="w-full md:w-1/4 font-medium flex items-center">
                        Mật khẩu
                    </span>
                    <details className="group select-none w-full">
                        <summary
                            className="group flex flex-wrap items-center rounded-lg md:px-4 py-2 "
                        >
                            <div className="md:ml-3" ref={passwordRef}>
                                <div className="group-open:hidden">
                                    Đặt lại mật khẩu của bạn thường xuyên để giữ tài khoản của bạn
                                    chắc chắn
                                </div>
                                <div className="hidden group-open:block">
                                    <span>
                                        Để thay đổi mật khẩu của bạn, vui lòng nhấn enter </span>
                                </div>
                            </div>
                            <div
                                className="ml-auto shrink-0 text-secondary cursor-pointer p-2 rounded-md hover:bg-blue-100">
                                <span className="group-open:hidden"> Đổi </span>
                                <span className="hidden group-open:block">Huỷ</span>
                            </div>
                        </summary>

                        <nav aria-label="Users Nav" className="mt-2 md:ml-8 transition-all">
                            <div className=" flex flex-col">
                                <label htmlFor="current-password">Mật khẩu hiện tại</label>
                                <input id="current-password"
                                    type="password"
                                    className="w-full md:w-2/6 mb-2.5 "
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                {errors.oldPassword && (
                                    // @ts-ignore
                                    <p className="text-red-500">{errors.oldPassword.message}</p>
                                )}
                            </div>
                            <div className=" flex flex-col">
                                <label htmlFor="new-password">Mật khẩu mới</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="w-full md:w-2/6 mb-2.5 "
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                {errors.newPassword && (
                                    // @ts-ignore
                                    <p className="text-red-500">{errors.newPassword.message}</p>
                                )}
                            </div>
                            <button
                                className={`float-right w-max text-white bg-lightPrimary px-2.5 py-2 rounded-md`}
                                // disabled={!isValid}
                                onClick={handleChangePasswords}
                            >
                                Lưu
                            </button>
                        </nav>
                    </details>
                </div>
                {/* Account */}
                <div className="border-y px-2.5 py-4 flex flex-wrap md:flex-nowrap w-full">
                    <span className="w-full md:w-1/4 font-medium flex items-center">Xoá tài khoản</span>
                    <details className="group select-none w-full">
                        <summary
                            className="group flex flex-wrap items-center rounded-lg md:px-4 py-2 "
                        >
                            <div className="md:ml-3">
                                <div className="group-open:hidden flex flex-col gap-y-2.5">
                                    <span>Xoá vĩnh viễn tài khoản</span>
                                </div>
                                <div className="hidden group-open:block">
                                    <span>Tại sao bạn muốn khoá tài khoản?</span>
                                </div>
                            </div>

                            <div
                                className="ml-auto shrink-0 text-secondary cursor-pointer p-2 rounded-md hover:bg-blue-100">
                                <span className="group-open:hidden"> Xoá tài khoản </span>
                                <span className="hidden group-open:block">Huỷ</span>
                            </div>
                        </summary>

                        <nav aria-label="Users Nav" className="mt-2 md:ml-8 transition-all">
                            <div className="w-full md:w-5/6 flex flex-col gap-2">
                                <span>Bạn có bất kỳ phản hồi nào muốn chia sẻ trước khi đi không?
                                    Chúng tôi sẽ sử dụng nó để khắc phục sự cố và cải thiện dịch vụ của mình..</span>
                                <input type="text" className=" mb-2.5" />
                            </div>
                            <button
                                className="float-right w-max text-white bg-lightPrimary px-2.5 py-2 rounded-md"
                                onClick={handleDeleteMyAccount}
                            // disabled={isDeleting}
                            >Xoá tài khoản
                            </button>
                        </nav>
                    </details>
                </div>
            </div>
        </div>
    )
}

export default Security
