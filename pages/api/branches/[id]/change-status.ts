

import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = request.headers['authorization'];
    const { id } = request.query;
    const fetchUrl = `http://localhost:1802/api/branches/${id}/change-status`;

    const requestOptions = {
        method: request.method,
        body: JSON.stringify(request.body),
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Bearer ' + `${token}`,
        }),
    };
    return await fetch(fetchUrl, requestOptions);
}


