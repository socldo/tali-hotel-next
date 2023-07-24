

import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/create`;

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
        response.status(apiResponse.status).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}


