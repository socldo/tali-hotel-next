import { data } from "autoprefixer";
import { apiUrl } from "../../../utils/config";

export const config = {
    runtime: "experimental-edge",
};
interface Branch {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    status: boolean;
}

export default async function handlerBranch(response: Response) {

    response = await fetch(apiUrl+"/branches", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMzcyMjAyODIwIiwiaWF0IjoxNjg2NzMwNjgyLCJleHAiOjE2ODY4MTcwODJ9.9oDXYaYD05g5Af_M4dxPe4rDqUaHkwM2k6nLXLsJfrUx-bp4f8I2vWLdsyToY0jB_fFBqwzshL4QFtIOq9n-5g"
        }),
    });

    if ((response).ok) {
        console.log(1);
        
        return (response);

    } else {
        console.error("Error:", (await response).json().then( x => x.message));
    }
}