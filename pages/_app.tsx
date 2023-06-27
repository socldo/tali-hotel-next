import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import NProgress from 'nprogress'
import { store, persistor } from '../store/store'
import { Header } from '../components/layout'

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/CubeLoader.css'

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import AdminLayout from './admin/AdminLayout'


export default function App({ Component, pageProps, router }: AppProps) {

    const isAdminPage = router.pathname.startsWith('/admin');


    NProgress.configure({ showSpinner: false })
    useEffect(() => {
        Router.events.on('routeChangeStart', (url) => {
            NProgress.start()
        })

        Router.events.on('routeChangeComplete', (url) => {
            NProgress.done(false)
        })
    }, [])

    if (isAdminPage) {
        return (
            <AdminLayout>
                <Component {...pageProps} />
            </AdminLayout>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Header />
                <Component {...pageProps} />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    draggable={false}
                    closeOnClick
                    pauseOnHover
                />
            </PersistGate>
        </Provider>
    )
}
