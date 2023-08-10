import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { area_id, hotel_id, from_date, to_date, group_by_type } = request.query;

    const queryParams = querystring.stringify({ area_id, hotel_id, from_date, to_date, group_by_type });

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reports/customer-review`;

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
        response.status(apiResponse.status).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}