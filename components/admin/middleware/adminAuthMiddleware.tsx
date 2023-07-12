import { useRouter } from 'next/router';
import { useEffect } from 'react';

const adminAuthMiddleware = (WrappedComponent: React.ComponentType) => {
    const WithAdminAuth: React.FC = (props) => {
        const router = useRouter();
        const role: number = 2;// Lấy vai trò từ nguồn cookie

        useEffect(() => {


            if (role == 1 && router.pathname.startsWith('/admin')) {
                router.push('/404');
            }
        }, [router.pathname]);

        return <WrappedComponent {...props} />;
    };

    return WithAdminAuth;
};

export default adminAuthMiddleware;
