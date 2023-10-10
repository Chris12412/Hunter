import React, { useState, useEffect, useRef, useContext, useReducer, useMemo } from 'react';
import '../../assets/css/views/login.css'
import { AuthFetch } from '../../services/api';
// import { UserReducers } from '../reducers/UserReducers'
import logoBeex from '../../assets/images/logo_beex.png'
import { useHistory } from "react-router-dom";
import { UserContext } from '../../context/provider/UserProvider'
import { SocketContext } from '../../context/provider/SocketProvider'
import { notify } from '../../utils/utils'
import { ContenedorParametros } from '../components/utils/ContenedorParametros';
import { SocketReducers } from '../../context/reducers/SocketReducers';


// import io from "socket.io-client";
import { useUsuarioEstado } from '../../hooks/useUsuarioEstado';
// const socket = io(process.env.REACT_APP_SOCKET_SESION);
    let usuarioEnSesion = false;

export const iniciarSesion = async (user, password, signIn) => {
    const usuarioSocket = {
        usuario: user.toUpperCase(),
        sesion : 0,
        token: "",
        // conectado: false
    }
    // socket.emit("validarSesion", usuarioSocket);

    // socket.on("respuestaConexion", respuestaConexion=>{
    //         usuarioEnSesion = !respuestaConexion
    // })
    
    const details = {
        "client_id": process.env.REACT_APP_CLIENT_ID,
        "client_secret": process.env.REACT_APP_CLIENT_SECRET,
        "grant_type": process.env.REACT_APP_GRANT_TYPE,
    };

    let formBody = [];

    for (var property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");


    const response = await fetch(process.env.REACT_APP_OAUTH_WEB_API + '/connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    }).then(res => res.json());

    const responseLogin = await fetch(process.env.REACT_APP_BEEDRONE_WEB_API + '/User/loginUsuario?'+  new URLSearchParams({
        nomUsuario: user,
        contraseña: password
    }),
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': response.token_type + ' ' + response.access_token
        },
    }).then(res => res.json());

    if (!usuarioEnSesion){
        if (responseLogin.isValid) {
            const timeExpire = new Date(new Date().getTime() + responseLogin.content.tiempoExpiraMiliSegundos * 1000);
            signIn({
                ...responseLogin.content,
                tokenExpire: timeExpire,
            });
            return true
        }
    }    
    return false
}

const useLogin = () => {
    const inputUsuario = useRef();
    const history = useHistory();
    const { stateUser, signIn } = useContext(UserContext);
    const { mqttConnect } = useContext(SocketContext);
    const [ user, setUser ] = useState();
    const [ password, setPassword ] = useState(); //culqi
    

    useEffect(() => {

        // if (stateUser.token == '') localStorage.setItem('user','')

        // history.push('/login')

        const isLogged = stateUser.token != ''
        isLogged && history.push('/recargas')
        inputUsuario.current.focus()

    }, [])

    const ingresar = async (e) => {
        e.preventDefault();
        const ingreso = await iniciarSesion(user, password, signIn);
        const usuarioSocket = {
            usuario: user.toUpperCase(),
            sesion : 0,
            token:"",
        }
        
        if (ingreso) {
            mqttConnect()
            history.push('/recargas')





            // localStorage.setItem('user', user )
            // socket.on("matarSesion", desconectar=>{
            //     if (desconectar == true) {
            //         // localStorage.setItem("pm-session","")
            //         // localStorage.clear()
            //         // notify("DESCONEC+TAR USUARIO", "error")
            //     }
            // })
            
            const usuarioSocket= {
                usuario : stateUser.nomUsuario.toUpperCase(),
                sesion : localStorage.getItem('sesion'),
                token: stateUser.token,
            }      
    
            // socket.emit("registrarSocket",usuarioSocket);
            
        } else {
            if (!usuarioEnSesion){
                localStorage.setItem("pm-session","")
                localStorage.clear()
                // socket.emit("errorLogeo",usuarioSocket);
            }
            // if(!usuarioEnSesion) 
            notify(usuarioEnSesion? 'Este Usuario ya se encuentra logeado' : 'Usuario o contraseña incorrectos' , 'error')
        }
    }

    return {
        user,
        setUser,
        password,
        setPassword,
        ingresar,
        inputUsuario,
        stateUser
    }
}

export const Login = () => {
    const login = useLogin();
    return (
        <div className="dark:bg-slate-800 h-screen">
            <div className="container flex justify-center items-center relative bottom-0 top-0 right-0 left-0 h-full">
                <div className="bg-white dark:bg-slate-900 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl w-[30%] lg:w-[60%] xl:w-[30%]">
                    <div className="flex justify-center">
                        <span className="inline-flex items-center justify-center p-2 bg-gray-800 rounded-md shadow-lg">
                            <img src={logoBeex} alt='' style={{marginBottom:'25px'}}/>

                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"></svg>
                        </span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white mt-5 text-[20px] text-base font-medium tracking-tight text-center">Iniciar Sesión</h3>

                    <form onSubmit={(e) => login.ingresar(e)}>
                        <div className="form flex flex-col py-10">
                            <div className="mb-4">
                                <input ref={login.inputUsuario} onChange={(e) => login.setUser(e.target.value)} defaultValue={login.user} className="text-white h-10 rounded px-4 w-full bg-gray-800 focus:outline-none focus:ring focus:ring-blue-500" placeholder="Usuario"/>
                            </div>
                            <div>
                                <input type="password" onChange={(e) => login.setPassword(e.target.value)} defaultValue={login.password} className="text-white h-10 rounded px-4 w-full bg-gray-800 focus:outline-none focus:ring focus:ring-blue-500" placeholder="Contraseña"/>
                            </div>
                        </div>
                        <div className="content-buttons mt-4">
                            <button type="submit" className="dark:bg-blue-500 hover:bg-blue-600 w-full text-white py-2 px-4 rounded">
                                INGRESAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

