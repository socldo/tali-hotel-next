import { getCookie } from 'cookies-next';
import querystring from 'querystring';
import { useEffect, useState } from 'react';
import { Model } from '../../../interface';


function News() {

    const [news, setReviews] = useState<Model.News[]>([]);
    const [responseAPI, setResponseAPI] = useState<Model.APIResponse>({ status: 200, message: 'OK', data: null });
    const [loading, setLoading] = useState(true);

    const [renderCount, setRenderCount] = useState(0);

    const token = getCookie('jwt_token')?.toString();

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(async () => {
            await fetchNews();
        }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [renderCount]);

    const fetchNews = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/news/get-list`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: !token ? "" : token
                }),
            });

            const data = await response.json();
            console.log('data:', data);

            setReviews(data.data);
            setLoading(false);

            setResponseAPI({
                status: data.status,
                message: data.message,
                data: data.data,
            });

        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    return (
        <>Hello

        </>
    );
}

export default News;