import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../../context/provider/UserProvider';
import { useHistory } from "react-router-dom";
import { useCerrarSesion } from '../../../hooks/useCerrarSesion';
import { Timer } from './Timer';
import LogoAbexa2018 from '../../../assets/images/LogoAbexa2018.png'
import { SocketContext } from '../../../context/provider/SocketProvider'



// import io from "socket.io-client";
// const socket = io(process.env.REACT_APP_SOCKET_SESION);




export const Header = ({openMenu}) => {

    const dropDown = useRef()
    const { stateUser, signOut } = useContext(UserContext)
    const { mqttDisconnect } = useContext(SocketContext)
    const history = useHistory();
    const { cerrarSesion } = useCerrarSesion(); 

    const singOutSession = () => {        
        cerrarSesion()
        mqttDisconnect();
        signOut()
        history.push('/login')
        // socket.emit("cerrarSesion",usuarioSocket);

    }
    const usuarioSocket= {
        usuario : stateUser.nomUsuario.toUpperCase(),
        sesion : localStorage.getItem('sesion'),
    }
    const toggleUser = () => {  
        const isClosed = dropDown.current.classList.contains('hidden')
        isClosed && dropDown.current.classList.remove('hidden')
        !isClosed && dropDown.current.classList.add('hidden')
    }
    const cerrarOpciones = () =>{
        const isClosed = dropDown.current.classList.contains('hidden')
        isClosed && dropDown.current.classList.remove('hidden')
        !isClosed && dropDown.current.classList.add('hidden')

    }
    return (    
        <>
            <div className="header">
                <nav>
                    <div className="width-full px-4 lg:px-2">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex items-center hidden lg:flex w-[110px]">
                            <button onClick={openMenu} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <i className="fas fa-bars text-[20px]"></i>
                            </button>
                        </div>

                        <div className="flex-1 flex items-stretch justify-start lg:items-center lg:justify-center">
                            <div className="flex-shrink-0 flex justify-center items-center w-[300px]" >
                                {/* <img className="w-[280px] h-[55px] block lg:block sm:w-52 sm:h-14 w-auto" src={LogoAbexa2018} alt="Workflow"/> */}
                            </div>
                        </div>

                        <div className="lg:relative w-[200px] h-[100%] lg:w-[100px] flex items-center lg:right-0 inset-auto ml-6">
                            <div className='top-9 right-[160px] lg:right-[2px] bottom-[1px] lg:top-5' >
                                <Timer className='lg:right-[2px] lg:top-1 top-1 right-[1px]'></Timer>
                                <button onClick={() => toggleUser()} onBlur={() => cerrarOpciones()} className="lg:right-[1px]  right-[75px] lg:top-5 absolute bottom-0 px-1 py-1 hover:bg-blue-600 rounded">
                                    <span className="lg:text-[15px] text-[18px]">{ stateUser.nomUsuario }</span>
                                </button>   
                            </div>
                        </div>

                        <div ref={dropDown} className="absolute top-[66px] right-0 hidden z-50 w-44 bg-white rounded divide-y divide-blue-100 shadow dark:bg-blue-800">
                            <ul className="py-1 text-sm text-white-700 dark:text-white-900" aria-labelledby="dropdownButton">
                                <li><a onClick={() => singOutSession()} className="block py-2 px-4 hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white">Cerrar Sesión</a></li>
                            </ul>
                            <ul className="py-1 text-sm text-white-700 dark:text-white-900" aria-labelledby="dropdownButton">
                                <li><a  className="block py-2 px-4 hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white">Cambiar clave</a></li>
                            </ul>
                        </div>
                    </div>
                    </div>
                </nav>
            </div>
        </>
    )
}