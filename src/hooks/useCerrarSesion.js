import { useState, useEffect,useContext } from 'react';
import { AuthFetch } from '../services/api';
import { notify } from '../utils/utils';
import { UserContext } from '../context/provider/UserProvider';

// import io from "socket.io-client";
// const socket = io(process.env.REACT_APP_SOCKET_SESION);

// const urlBasePlamin = process.env.REACT_APP_PLAMIN_API + "/api";

export const useCerrarSesion = () => {
    const { stateUser, signIn } = useContext(UserContext);

    const cerrarSesion = async () => {
        const decifrado = atob(localStorage.getItem('pm-session') || '')
        const datosSession = decifrado == '' ? {} : JSON.parse(decifrado);
        const response = await AuthFetch('/Query/cerrarSesion',{
            method:'PUT',
            body: JSON.stringify({
            codUsuarioSesion:datosSession.codSesion,
            })
        })
        if(response.isValid) {
            // const usuarioSocket= {
            //     usuario : stateUser.nomUsuario.toUpperCase(),
            //     sesion : localStorage.getItem('sesion'),
            // }
            // socket.emit("cerrarSesion",usuarioSocket);
            localStorage.setItem("sesion",0)
        }
        notify(response.content,response.isValid? 'success': 'error')
    }
    return { cerrarSesion };
}