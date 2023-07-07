import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { status } = request.query;

    const queryParams = querystring.stringify({ status });

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/get-list`;

    const fetchUrl = `${baseUrl}?${queryParams}`;

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
        const apiResponse = await fetch(fetchUrl, requestOptions);


        const data = await apiResponse.json();
        response.status(apiResponse.status).json(data); // Gửi phản hồi về client
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
}