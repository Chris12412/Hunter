import { useState, useEffect } from 'react';
import { notify } from '../utils/utils';
import { AuthFetchAtu } from '../services/api';

export const useSugerencias = () => {
    const [ sugerencia, setSugerencia ] = useState([]);
    useEffect(() => {
        listarSugerencia();
    }, []);

    const listarSugerencia = async () => {
        const response = await AuthFetchAtu('/Reclamo/sugerencia')
        if(response.isValid){
            setSugerencia(response.content)
        }else{
            notify(response.exceptions[0].description, 'error');
        }
    }
    return { sugerencia ,listarSugerencia}
}