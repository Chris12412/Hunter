import { useState, useEffect } from 'react';
import { AuthFetch } from '../services/api';


export const useTipoUsuario = () => {
    const [ tipoUsuarios, setTipoUsuario ] = useState([]);

    useEffect(() => {
        listarTipoUsuarios();
    }, []);

    const listarTipoUsuarios = async () => {
        const response = await AuthFetch('/User/listarTipoUsuarios')
        if (response.isValid) {
            setTipoUsuario(response.content);
        } else {
            alert(response.content);
        }
    }
    return { listarTipoUsuarios, tipoUsuarios };
}