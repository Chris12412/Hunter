import React, { createContext, useReducer } from "react";
// import { createNo    SubstitutionTemplateLiteral } from "typescript";
import { UserReducers } from "../reducers/UserReducers";
import { UserTypes } from "../types/UserTypes";

export const UserContext = createContext()

export function UserProvider(props) {
    const decifrado = atob(localStorage.getItem('pm-session') || '')
    const datosSession = decifrado == '' ? {} : JSON.parse(decifrado);
    // const decifradoPuntos = atob(localStorage.getItem('pm-poligonos') || '')
    // const localPuntos = decifradoPuntos === '' ? {} : JSON.parse(decifradoPuntos);


    const initialUserState = {
        codUsuario: datosSession.codUsuario || 0,
        nomUsuario: datosSession.nomUsuario || '',
        token: datosSession.token || '',
        tiempoExpiraMiliSegundos: datosSession.tiempoExpiraMiliSegundos || 0,
        tokenType: datosSession.tokenType || '',
        codUsuarioTipo: datosSession.codUsuarioTipo || 0,
        codSesion: datosSession.codSesion || 0,
        rol: datosSession.rol || '',
        nombre: datosSession.nombre || '',
        apellidoPaterno: datosSession.apellidoPaterno || '',
        apellidoMaterno: datosSession.apellidoMaterno || '',
        menus: datosSession.menus || [],
        permisos: datosSession.permisos || [],
    }
    const [ state, dispatch ] = useReducer(UserReducers, initialUserState)

    const signIn = (objSession) => {
        var cifrado = btoa(JSON.stringify(objSession));
        localStorage.setItem('pm-session', cifrado);
        
        localStorage.setItem("name-user", objSession.nomUsuario);
        localStorage.setItem('sesion', objSession.codSesion)

        // localStorage.setItem("password-user", objSession.passwordUser);
        // localStorage.setItem("token", objSession.token);
        // localStorage.setItem("token-type", objSession.tokenType);
        // localStorage.setItem("token-expire", objSession.tokenExpire);
        // localStorage.setItem("menus", objSession.menus);
        // localStorage.setItem("permisos",objSession.permisos)

        dispatch({type: UserTypes.SIGN_IN, payload: objSession})
    }
    const signOut = () => {
        localStorage.clear();
        dispatch({type: UserTypes.SIGN_OUT})
    }

    return (
        <UserContext.Provider value={{stateUser: state, signIn, signOut}}>
            {props.children}
        </UserContext.Provider>
    )
}