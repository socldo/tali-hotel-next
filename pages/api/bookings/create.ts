import { log } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const requestBody = request.body;

    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/create`;

    const bookingData = {
        user_id: requestBody.user_id,
        hotel_id: requestBody.hotel_id,
        check_in: requestBody.check_in,
        check_out: requestBody.check_out,
        status: 0,
        amount: requestBody.amount,
        total_amount: requestBody.total_amount,
        deposit_amount: requestBody.deposit_amount,
        room_data: requestBody.room_data,
        first_name: requestBody.first_name,
        last_name: requestBody.last_name,
        phone: requestBody.phone,
        email: requestBody.email
    };
    console.log("body :", bookingData);

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
        body: JSON.stringify(bookingData)
    };
    try {
        const apiResponse = await fetch(baseUrl, requestOptions);

        const data = await apiResponse.json();

        response.status(apiResponse.status).json(data); // Gửi phản hồi về client

    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
}