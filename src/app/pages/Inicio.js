import React from 'react';
import {
    Link
} from 'react-router-dom'
export const Inicio = () => {
    return (
        <>
            <h1>Beex Web</h1>
            <Link to="/login">Login</Link>
        </>
    )
}