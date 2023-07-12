import { NextApiRequest, NextApiResponse } from "next";
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const url = request.url;

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    
    const requestOptions = {
        method: request.method,
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer ' + `${request.headers['authorization']}`,
            // `${request.headers['authorization']}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",

        }),
        queryParams: {

        }
    };

    try {
        const apiResponse = await fetch(baseUrl, requestOptions);


        const data = await apiResponse.json();
        // console.log(data);
        response.status(apiResponse.status).json(data); // Gửi phản hồi về client
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
}