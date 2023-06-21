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

export default async function handlerBranch(request :Request, response: Response) {

    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": 'Bearer ' + `${request.headers.get('authorization')}`,
        }),
    });

    if ((response).ok) {
        
        return (response);

    } else {
        console.error("Error:", response.json().then( x => x.message));
    }
}