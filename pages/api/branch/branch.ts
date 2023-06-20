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

    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMzcyMjAyODA3IiwiaWF0IjoxNjg2ODIxNTEwLCJleHAiOjE2ODY5MDc5MTB9.GCL2zuqwTDv22bTQDsNH_JMcf38pOZIHJr869RNzr95KakXgsuRcIrytWO_1XmypFrqsVN3KzePnDNMR91oZNA"
        }),
    });

    if ((response).ok) {
        console.log(1);
        
        return (response);

    } else {
        console.error("Error:", response.json().then( x => x.message));
    }
}