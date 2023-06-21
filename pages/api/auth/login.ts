import { apiUrl } from "../../../utils/config";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
type User = {
    phone?: string;
    password?: string;
};

export const config = {
    runtime: "experimental-edge",
};

export default async function handler(request: Request, response: Response) {
    const data: User = await request.json();
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: request.method,
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
    });
    


    return response;
}
