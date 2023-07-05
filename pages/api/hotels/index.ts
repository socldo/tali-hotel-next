import { NextApiRequest, NextApiResponse } from "next";
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { branch_id, check_in, check_out, people_number, min_price, max_price, avarage_rate } = request.query;

    const queryParams = querystring.stringify({ branch_id, check_in, check_out, people_number, min_price, max_price, avarage_rate });

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/hotels`;

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
        queryParams: {

        }
    };

    try {
        const apiResponse = await fetch(fetchUrl, requestOptions);
        const data = await apiResponse.json();
        response.status(apiResponse.status).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}