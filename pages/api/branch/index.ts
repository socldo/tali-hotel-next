import { data } from "autoprefixer";

export const config = {
    runtime: "edge",
};
interface Branch {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    status: boolean;
}


export default async function handlerBranch() {

    console.log(1);

    const response = fetch("http://localhost:1802/api/branches", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
    });

    if ((await response).ok) {

        return (await response).json();

    } else {
        console.error("Error:", (await response).status);
    }

}