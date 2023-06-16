import { NextApiRequest, NextApiResponse } from "next";
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { branch_id,check_in ,check_out, people_number,min_price,max_price,avarage_rate } = request.query;

    const queryParams = querystring.stringify({ branch_id,check_in ,check_out, people_number,min_price,max_price,avarage_rate });

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`;

    const fetchUrl = `${baseUrl}?${queryParams}`;

    const requestOptions = {
        method: request.method,
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer ' + 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMzcyMjAyODA3IiwiaWF0IjoxNjg2ODIxNTEwLCJleHAiOjE2ODY5MDc5MTB9.GCL2zuqwTDv22bTQDsNH_JMcf38pOZIHJr869RNzr95KakXgsuRcIrytWO_1XmypFrqsVN3KzePnDNMR91oZNA',
            // `${request.headers['authorization']}`,
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
        console.log(data);
        response.status(apiResponse.status).json(data); // Gửi phản hồi về client
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
}