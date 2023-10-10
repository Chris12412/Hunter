import React, { Suspense } from "react";
import { BrowserRouter } from 'react-router-dom'
import { RoutesJSX } from './routing/Routes'
import { UserProvider } from '../context/provider/UserProvider'
import { SocketProvider } from '../context/provider/SocketProvider'

export const App = () => {
    return (
        <>
            <UserProvider>
                <SocketProvider>
                    <Suspense fallback={<h1>Cargando...</h1>}>
                        <BrowserRouter basename={process.env.REACT_APP_SUB_DIRECTORY}>
                            <RoutesJSX />
                        </BrowserRouter>
                    </Suspense>
                </SocketProvider>
            </UserProvider>
        </>
    )
}
