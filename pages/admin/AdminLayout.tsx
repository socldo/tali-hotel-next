import React, { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div>
            <header>
                chào
            </header>
            <main>
                {children}
            </main>
            <footer>
                chào
            </footer>
        </div>
    );
};

export default AdminLayout;
