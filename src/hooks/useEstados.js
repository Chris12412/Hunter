import { useState, useEffect } from 'react';
import { AuthFetch } from '../services/api';

// const urlBase = process.env.REACT_APP_BEEDRONE_WEB_API;

export const useEstados = () => {
    const [ estados, setEstados ] = useState([]);

    useEffect(() => {
        listarEstados();
    }, []);

    const listarEstados = async () => {
        const response = await AuthFetch('/Query/estadosPeticion')
        if (response.isValid) {
            setEstados(response.content)
        }
    }

    return [ estados ];
}

