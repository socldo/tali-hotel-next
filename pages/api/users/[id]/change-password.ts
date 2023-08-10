import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { old_password, new_password, id } = request.query;

    const queryParams = querystring.stringify({ old_password,new_password });
    const  baseUrl= `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/change-password`;
    const fetchUrl = `${baseUrl}?${queryParams}`;
    console.log(fetchUrl);
    
    const requestOptions = {
        method: request.method,
        body: JSON.stringify(request.body),
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer ' + `${request.headers['authorization']}`

        }),
    };
    try {
        const apiResponse = await fetch(fetchUrl, requestOptions);
        const data = await apiResponse.json();
        response.status(apiResponse.status).json(data); // Gửi phản hồi về client
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
}


