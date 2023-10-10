import { useState, useEffect } from 'react';
import { notify } from '../utils/utils';
import { AuthFetch } from '../services/api';
import { useModal } from './useModal';


export const useChatOnline = () => {

    const mensajeDefault = {
        codPeticion: 0,
        codUsuario: 0,
        nomUsuario:"",
        mensaje: "",
        codUsuarioDestino: 0,
        chatActivo: true
    }

    const [mensaje, setMensaje ] = useState(mensajeDefault)
    const [isOpenChat, openModalChat, closeModalChat] = useModal();

    const [ chat,setChat ] = useState([]);
    
    // useEffect(() => {
    //     obtenerChat();
    // }, [mensaje]);

        
    const guardarEditarMensaje= async () => {
        // console.log("MEnSAJE A ENVIAR -> ", mensaje)
        const response = await AuthFetch(`/Recharge/enviarNotificacionRecargaWebMobile` ,{
                method: 'POST',
                body: JSON.stringify({
                    codPeticion: mensaje.codPeticion,
                    mensaje: mensaje.mensaje,
                    codUsuarioDestino: mensaje.codUsuarioDestino,
                    chatActivo: mensaje.chatActivo
            }),
        });

        notify((response.isValid ? response.content : response.exceptions[0].description),(response.isValid ? 'success' : 'error') )
        
        if (response.isValid) {
            obtenerChat(mensaje.codPeticion)
            document.getElementById('txtComentario').value=''
        }else{
            notify(response.exceptions[0].description,'error')
        }
    }
    
    
    const obtenerChat = async (codPeticion) => {
            // console.log("CODPETICION -> " , codPeticion);
            const response = await AuthFetch(`/Recharge/listaNotificacionesRecargaWeb?` + new URLSearchParams({
                codPeticion: codPeticion || chat.codPeticion
            })) 
        if(response.isValid){
            // console.log("RESPONSE CHAT-> " , response)
            setChat(response.content)
            openModalChat()
        }else{
            notify(response.exceptions[0].description, 'error');
        }
    }

    const editarValorChat = (key,value) =>{
        // console.log("EDITAR VALORES DE CHAT ->" , key, value)
        setMensaje(mensaje => {
            return {
                ...mensaje,
                [key]: value
            }
        });
    }     





    return { chat ,obtenerChat, isOpenChat, openModalChat, closeModalChat, editarValorChat, guardarEditarMensaje }
}