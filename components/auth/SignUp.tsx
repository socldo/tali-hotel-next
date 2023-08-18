import React, { useEffect, useState } from 'react'
import { Button } from '../core'
import SocialsAuth from './SocialsAuth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SignUpForm } from '../../interface/auth'
import { signUpSchema } from '../../utils/validationSchema'

import { useRegisterUserMutation } from '../../services/authApi'
import { setUser } from '../../features/authSlice'
import { useAppDispatch } from '../../store/hooks'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { setHotelWishList } from '../../features/appSlice'
import { Layout } from '../layout'
import { deleteCookie } from 'cookies-next'
import PasswordInput from './PasswordInput'
import querystring from 'querystring';

interface Props {
    setIsSignIn: (arg: boolean) => void;
}

const SignUp = ({ setIsSignIn }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
        mode: 'onBlur',
        resolver: yupResolver(signUpSchema)
    });
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    register('role_id', { value: 1 });



    const handleDeleteCookie = async () => {
        // Sau khi đăng kí thành công, chuyển hướng đến trang login
        deleteCookie("jwt_token");
        deleteCookie("email");
        deleteCookie("phone");
        deleteCookie("name");
        deleteCookie("role");
        deleteCookie("jwtavatartoken");
    };

    useEffect(() => {
        handleDeleteCookie();
    })


    const router = useRouter()
    const dispatch = useAppDispatch()
    const [
        registerUser,
        {
            data: registerData,
            isSuccess: isRegisterSuccess,
            isError: isRegisterError,
            error: registerError
        }
    ] = useRegisterUserMutation()


    const onSubmit = async (data: SignUpForm) => {
        if (acceptedTerms) {
            return registerUser(data)
        }
        else {
            toast.warning('Vui lòng chấp nhận chính sách và điều khoản của chúng tôi');
        }
    };


    const handleAcceptTerms = () => {
        setAcceptedTerms(!acceptedTerms);
    };



    useEffect(() => {
        if (isRegisterSuccess) {
            dispatch(
                setUser({ user: registerData.user, token: registerData.token })
            )
            // dispatch(setHotelWishList(registerData.user.wishlist))
            router.push('/auth').then(() =>
                toast.success('Đăng ký thành công'))
            setIsSignIn(true)
        }
    }, [isRegisterSuccess])

    useEffect(() => {
        if (isRegisterError) {
            toast.error((registerError as any)?.data?.message ? (registerError as any).data.message : 'Some thing went error')
        }
    }, [isRegisterError])


    const handleChangeAuth = async () => {

        setIsSignIn(true);

    };


    return (
        <Layout
            metadata={{
                title: 'Sign up - Booking',
                description: 'Booking'
            }}
        >
            <main
                className="mt-10 md:mt-20 mx-auto container px-4 lg:px-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-2xl shadow-2xl w-full xl:w-2/3 flex flex-col md:flex-row">
                    <div className="w-full md:w-3/5 p-2.5 xl:p-5">
                        <div className="text-left font-bold">
                            <span className="text-primary"></span>
                        </div>
                        <div className="py-5 md:py-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary">
                                Đăng ký tài khoản
                            </h2>
                            <form className="w-full sm:w-4/5 mx-auto flex flex-col items-center mt-4"
                                onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-2.5 w-full">
                                    <label
                                        htmlFor="name"
                                        className={`block font-bold text-sm mb-1 ${errors.name ? 'text-red-400' : 'text-primary'
                                            }`}
                                    >
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`block rounded-xl w-full bg-transparent outline-none border-b-2 py-2 px-4  ${errors.name
                                            ? 'text-red-300 border-red-400'
                                            : 'text-primary'
                                            }`}
                                        {...register('name')}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            Tên không hợp lệ.
                                        </p>
                                    )}
                                </div>
                                <div className="mb-2.5 w-full">
                                    <label
                                        htmlFor="email"
                                        className={`block font-bold text-sm mb-1 ${errors.email ? 'text-red-400' : 'text-primary'
                                            }`}
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        className={`block rounded-xl w-full bg-transparent outline-none border-b-2 py-2 px-4  ${errors.email
                                            ? 'text-red-300 border-red-400'
                                            : 'text-primary'
                                            }`}

                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            Email không hợp lệ.
                                        </p>
                                    )}
                                </div>
                                <div className="mb-2.5 w-full">
                                    <label
                                        htmlFor="phone"
                                        className={`block font-bold text-sm mb-1 ${errors.email ? 'text-red-400' : 'text-primary'
                                            }`}
                                    >
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        className={`block rounded-xl w-full bg-transparent outline-none border-b-2 py-2 px-4  ${errors.phone
                                            ? 'text-red-300 border-red-400'
                                            : 'text-primary'
                                            }`}

                                        {...register('phone')}

                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">
                                            Số điện thoại không hợp lệ.
                                        </p>
                                    )}
                                </div>
                                <PasswordInput
                                    label="Mật khẩu"
                                    id="password"
                                    errors={errors.password}
                                    register={register('password')}
                                />

                                <PasswordInput
                                    label="Xác nhận mật khẩu"
                                    id="password2"
                                    errors={errors.password2}
                                    register={register('password2')}
                                />
                                <div>
                                    <label
                                        className="block mt-2"
                                        style={{
                                            position: 'relative',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            fontSize: '14px', // Điều chỉnh kích thước font tùy theo ý muốn
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={handleAcceptTerms}
                                            style={{
                                                opacity: 0,
                                                position: 'absolute',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <span
                                            style={{
                                                position: 'relative',
                                                width: '20px',
                                                height: '20px',
                                                border: '1px solid #ccc',
                                                marginRight: '8px', // Khoảng cách giữa checkbox và chữ
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            {acceptedTerms && (
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        left: '6px',
                                                        top: '2px',
                                                        width: '5px',
                                                        height: '10px',
                                                        border: 'solid black',
                                                        borderWidth: '0 2px 2px 0',
                                                        transform: 'rotate(45deg)',
                                                    }}
                                                ></span>
                                            )}
                                        </span>
                                        Chính sách và điều khoản
                                    </label>
                                </div>
                                <button type="submit" onClick={handleSubmit(onSubmit)}>
                                    <Button text="Đăng kí" textColor="text-white" bgColor="bg-primary" />
                                </button>
                            </form>

                        </div>
                    </div>

                    <div
                        className="w-full md:w-2/5 bg-lightPrimary text-white rounded-b-2xl md:rounded-none md:rounded-r-2xl px-8 py-12 xl:px-12
                        flex flex-col items-center justify-center"
                    >
                        <h2 className="text-3xl font-bold mb-2">Xin chào!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-2"></div>
                        <p className="mb-2">Bạn đã có tài khoản ?</p>
                        <div onClick={() => handleChangeAuth()}>
                            <Button text="Đăng nhập" textColor="text-secondary" bgColor="bg-white" />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default SignUp
