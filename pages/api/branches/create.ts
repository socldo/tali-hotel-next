// export const config = {
//     runtime: "experimental-edge",
// };

// export default async function handler(request: Request, response: Response) {


//     const token = request.headers.get('authorization');
//     const fetchUrl = "http://localhost:1802/api/branches/create";
//     const data: {} = await request.json();
//     const requestOptions = {
//         method: request.method,
//         body: JSON.stringify(data),
//         headers: new Headers({
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             Authorization: 'Bearer ' + `${token}`,
//         }),
//     };
//     return await fetch(fetchUrl, requestOptions);
// }


import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/branches/create`;


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


