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
    const token = request.headers['authorization'];
    const fetchUrl = `http://localhost:1802/api/branches/create`;


    const requestOptions = {
        method: request.method,
        body: JSON.stringify(request.body),
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer ' + `${token}`

        }),
    };
    return await fetch(fetchUrl, requestOptions);
}


