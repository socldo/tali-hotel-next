import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import { log } from 'util';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const url = request.url;

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    console.log(baseUrl);
    
    const requestOptions = {
        method: request.method,
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer ' + `${request.headers['authorization']}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",

        }),
    };

    try {
        const apiResponse = await fetch(baseUrl, requestOptions);

        const data = await apiResponse.json();
        response.status(apiResponse.status).json(data); // Gửi phản hồi về client
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
    
}