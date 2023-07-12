import { useRouter } from 'next/router';

const adminAuthMiddleware = <T extends React.ComponentType<any>>(WrappedComponent: T) => {
    const WithAdminAuth = (props: React.ComponentProps<T>) => {
        const router = useRouter();

        // Kiểm tra quyền truy cập ở đây, ví dụ: lấy role từ cookie hoặc local storage
        const role = 1;

        if (role === 1 && router.pathname.startsWith('/admin')) {
            // Nếu role = 1 và đường dẫn bắt đầu bằng '/admin', chuyển hướng về trang 404
            router.push('/404');
            return null;
        }

        // Trả về component gốc nếu không có điều kiện nào phù hợp
        return <WrappedComponent {...props} />;
    };

    return WithAdminAuth;
};

export default adminAuthMiddleware;
