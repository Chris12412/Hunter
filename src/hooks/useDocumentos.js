import { useState, useEffect } from 'react';
import { AuthFetchOauth } from '../services/api';

// const urlBasePlamin = process.env.REACT_APP_PLAMIN_API + "/api";

export const useDocumentos = () => {
    const [ documentos, setDocumentos ] = useState([]);

    useEffect(() => {
        listarDocumentos();
    }, []);

    const listarDocumentos = async () => {
        const response = await AuthFetchOauth('/api/Manager/listarTiposDocumentos');
        if (response.isValid) {
            setDocumentos(response.content);
        } else {
            alert(response.content);
        }
    }

    return { documentos };
}