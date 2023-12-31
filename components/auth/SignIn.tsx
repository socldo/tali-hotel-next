import React, { useEffect, useState } from "react";
import { Button } from "../core";
import SocialsAuth from "./SocialsAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signUpSchema } from '../../utils/validationSchema'
import { useRouter } from "next/router";
import { Layout } from "../layout";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { SignUpForm } from "../../interface/auth";
import { useDispatch } from "react-redux";
import { setUser } from "./auth";

interface Props {
    setIsSignIn: (arg: boolean) => void;
}


export default function SignIn({ setIsSignIn }: Props) {

    const handleDeleteCookie = async () => {
        // Sau khi đăng kí thành công, chuyển hướng đến trang login
        deleteCookie("jwt_token");
        deleteCookie("email");
        deleteCookie("phone");
        deleteCookie("name");
        deleteCookie("role");
        deleteCookie("avatar");
    };

    useEffect(() => {
        handleDeleteCookie();
    }, [])


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [jwtToken, setJwtToken] = useState("");

    const { register, formState: { errors } } = useForm<SignUpForm>({
        mode: 'onBlur',
        resolver: yupResolver(signUpSchema)
    })
        ;

    const handleSignUp = async () => {
        // Sau khi đăng kí thành công, chuyển hướng đến trang login
        setIsSignIn(false)
        router.push("/auth");
    };

    const handleRegister = async () => {
        // Sau khi đăng kí thành công, chuyển hướng đến trang login
        router.push("/");
    };



    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                phone: username,
                password: password,
            }),
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        });
        const json = await response.json();

        if (json.status == 200) {
            toast.success("Đăng nhập thành công!");

            setTimeout(() => {
                handleRegister();
            }, 100);

            const data = json.data;
            const token = data.jwt_token;
            setCookie("jwt_token", token);
            setCookie("id", data.id);
            setCookie("email", data.email);
            setCookie("phone", data.phone);
            setCookie("name", data.name);
            setCookie("role_name", data.role);
            setCookie("avatar", data.avatar);
            setCookie("role_id", data.role_id);

        } else {
            toast.warning("Sai số điện thoại hoặc mật khẩu!");
            deleteCookie("jwt_token");
        }
    };

    return (
        <Layout
            metadata={{
                title: "Sign in - Booking",
                description: "Booking",
            }}
        >
            <main className="mt-10 md:mt-20 mx-auto container px-4 lg:px-6 flex flex-col items-center justify-center text-center">
                <div className="rounded-2xl shadow-2xl w-full xl:w-2/3 flex flex-col md:flex-row">
                    <div className="w-full md:w-3/5 p-2.5 xl:p-5">
                        <div className="text-left font-bold"></div>
                        <div className="py-5 md:py-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary">
                                Sign in to Account
                            </h2>
                            <div className="border-2 w-10 border-primary inline-block mb-2"></div>
                            <SocialsAuth />
                            <p className="text-gray-400">or use your email account</p>
                            <form
                                className="w-full sm:w-4/5 mx-auto flex flex-col items-center"
                                onSubmit={handleSubmit}
                            >
                                <div className="mb-2.5 w-full">
                                    <label
                                        htmlFor="email"
                                        className={`block font-bold text-sm mb-1${errors.phone ? "text-red-400" : "text-primary"
                                        }`}
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`block rounded-xl w-full bg-transparent outline-none border-b-2 py-2 px-4  ${errors.phone
                                            ? "text-red-300 border-red-400"
                                            : "text-primary"
                                        }`}
                                    />
                                    {errors.phone &&
                                        (
                                            <p className="text-red-500 text-sm mt-1">
                                                A valid phone is required.
                                            </p>
                                        )}
                                </div>
                                <div className="mb-2.5 w-full">
                                    <label
                                        htmlFor="password"
                                        className={`block font-bold text-sm mb-1 ${errors.password ? "text-red-400" : "text-primary"
                                        }`}
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`block rounded-xl w-full bg-transparent outline-none border-b-2 py-2 px-4  ${errors.password
                                            ? "text-red-300 border-red-400"
                                            : "text-primary"
                                        }`}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            Your password is required.
                                        </p>
                                    )}
                                </div>
                                <button type="submit" onClick={handleSubmit}>
                                    <Button
                                        text="Sign In"
                                        textColor="text-white"
                                        bgColor="bg-primary"
                                    />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div
                        className="w-full md:w-2/5 bg-lightPrimary text-white rounded-b-2xl md:rounded-none md:rounded-r-2xl px-8 py-12 xl:px-12
                        flex flex-col items-center justify-center"
                    >
                        <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-2"></div>
                        <p className="mb-2">
                            Fill up personal information and start journey with us.
                        </p>
                        <div onClick={() => handleSignUp()}>
                            <Button
                                text="Sign Up"
                                textColor="text-secondary"
                                bgColor="bg-white"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

