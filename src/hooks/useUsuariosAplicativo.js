import { useState, useEffect, useContext } from "react";
import { notify } from "../utils/utils";
import { AuthFetch } from "../services/api";
import { useModal } from './useModal';
import { useSpinner } from "./useSpinner";
import { UserContext } from "../context/provider/UserProvider";

const urlBasePlamin = process.env.REACT_APP_PLAMIN_API + "/api";

export const useUsuariosAplicativo = () => {
    const { stateUser , signOut } = useContext(UserContext);
    const usuarioDefault = {
        codUsuarioEstado:0,
        codUsuarioOAuth: 0,
        nomUsuario: '',
        correoPrincipal: '',
        nomPersona: '',
        numeroDocumento: '',
        numCelularPrincipal: '',
        fechaRegistro:'',
        codEstado: 0,
        motivoCambioEstado:''    
    }
    const [ usuarios, setUsuarios ] = useState([]);
    const [ usuario, setUsuario ] = useState(usuarioDefault);
    const [ spinner, mostrarSpinner, ocultarSpinner ] = useSpinner();
    const [ isOpen, openModal, closeModal] = useModal();
    const [ isOpenCambiarEstado, openModalCambiarEstado, closeModalCambiarEstado] = useModal();

    
    useEffect(() => {
        listarUsuarios(0);
    }, []);

    const listarUsuarios = async (codEstado) => {
        mostrarSpinner();
        const response = await AuthFetch('/User/listarUsuarios?' + new URLSearchParams({
            codEstado: codEstado,
        }), {
            method: 'GET'
        })
        if (response.isValid) {
            setUsuarios(response.content)
        } else {
            alert('Hubo un problema')
        }
        ocultarSpinner()
    }
    
    const obtenerUsuario = async (codUsuarioOAuth) => {
        if (codUsuarioOAuth){
            const response = await AuthFetch('/User/obtenerUsuarioPorCodUsuario?'+ new URLSearchParams({
                codUsuario :codUsuarioOAuth
            }),{
                method: 'GET',
            })
            setUsuario(response.content)
        }else{
            setUsuario(usuarioDefault);
        }
        openModal();
    }

    const obtenerUsuarioCambiarEstado = async (codUsuarioOAuth) => {
        if (codUsuarioOAuth){
            const response = await AuthFetch('/User/obtenerUsuarioPorCodUsuario?'+ new URLSearchParams({
                codUsuario :codUsuarioOAuth
            }),{
                method: 'GET',
            })
            setUsuario(response.content)
        }else{
            setUsuario(usuarioDefault);
        }
        openModalCambiarEstado();
    }
    
    const cambiarEstadoUsuario = async () =>{
        const response = await AuthFetch({
            url : urlBasePlamin + '/usuario/eliminarUsuario',
            method : 'POST',
            body : JSON.stringify({
                codUsuario: usuario.codUsuarioOAuth,
                codEstado: usuario.codEstado,
                motivoEliminacion: usuario.motivoCambioEstado
            })
        })
        notify(response.content, response.isValid? 'success' : 'error');
        if (response.isValid){
            await listarUsuarios();
            closeModal()
        }
    }
    
    const editarValorUsuario = (key,value) =>{
        setUsuario(usuario => {
            return {
                ...usuario,
                [key]: value
            }
        });
    }     
    return {usuarios, listarUsuarios,usuario,editarValorUsuario,obtenerUsuario, spinner,isOpen, closeModal, cambiarEstadoUsuario,isOpenCambiarEstado,closeModalCambiarEstado,obtenerUsuarioCambiarEstado};
}