// import { useState, useEffect } from 'react';
// import { AuthFetch } from '../services/api';

// export const useEstadosUsuarios = () => {
//     const [ estadosUsuarios, setEstadosUsuarios ] = useState([]);

//     useEffect(() => {
//         listarEstadosUsuarios();
//     }, []);

//     const listarEstadosUsuarios = async () => {
//         const response = await AuthFetch('/api/Manager/listarEstadosUsuarios');
//         if (response.isValid) {
//             setEstadosUsuarios(response.content);
//         } else {
//             alert(response.content);
//         }
//     }
    
//     return { estadosUsuarios };
// }