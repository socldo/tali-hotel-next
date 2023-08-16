import { log } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const requestBody = request.body;

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`;

    const phone = {
        phone: requestBody.phone,
    };
    console.log("body :",phone);
    
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
        body: JSON.stringify(phone)
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