import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import querystring from 'querystring';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { vnp_Amount} = request.query;

    const vnp_CreateDate = moment(new Date()).format("yyyyMMddHHmmss")

    const queryParams = querystring.stringify({ vnp_Amount, vnp_CreateDate});
    
    
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/hotels`;

    const fetchUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Command=pay&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42` + queryParams;

    const requestOptions = {
        method: request.method,
        headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            // Authorization: 'Bearer ' + `${request.headers['authorization']}`,
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
        // console.log(data);
        response.status(apiResponse.status).json(data); // Gửi phản hồi về client
    } catch (error) {
        console.error('Error fetching data:', error);
        response.status(500).json({ error: 'Internal Server Error' }); // Gửi phản hồi lỗi về client
    }
}