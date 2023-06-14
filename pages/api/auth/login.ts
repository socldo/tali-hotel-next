import { apiUrl } from "../../../utils/config";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
type User = {
  username?: string;
  password?: string;
};

export const config = {
    runtime: "experimental-edge",
};

export default async function handler(request: Request, response: Response) {
    const data: User = await request.json();
    console.log(data);
    
    response = await fetch(apiUrl + "/auth/signin", {
        method: request.method,
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        }),
    });

    
    return response;
}
