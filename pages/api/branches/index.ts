import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const data: {} = request.body;
    const token = request.headers['authorization'];

    try {
        const apiResponse = await fetch("http://localhost:1802/api/branches", {
            method: request.method,
            // body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // Authorization: token,
            } as HeadersInit, // Specify the type as HeadersInit
        });

        const responseData = await apiResponse.json();

        const { status, message, data: apiData } = responseData;
        response.status(status).json({ status, message, data: apiData });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
}
