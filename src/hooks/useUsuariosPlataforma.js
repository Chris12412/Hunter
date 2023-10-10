import { useState, useEffect, useContext } from "react";
import { notify } from "../utils/utils";
import { AuthFetch, AuthFetchOauth } from "../services/api";
import { useModal } from './useModal';
// import { useModal } from "../useModal";
import { useSpinner } from "./useSpinner";
import { UserContext } from "../context/provider/UserProvider";
// import { isConstructorDeclaration } from "typescript";
// import { useTipoUsuario } from "./useTipoUsuario";


export const useUsuariosPlataforma = () => {
    const { stateUser , signOut } = useContext(UserContext);
    const usuarioDefault = {
        codUsuario: 0,
        codPersona: 0,
        nomUsuario: '',
        nomPersona: '',
        codDocumentoTipo: 0,
        nomDocumentoTipo: '',
        numDocumento: '',
        telefonoActual: '',
        codEstado: 0,
        nomEstado: '',
        codUsuarioAccion: 0,
        correoPrincipal: '',
        correoActual:'',
        clave: '',
        motivo:'',
        codTipoUsuario:0
    }
    
    const [ usuarios, setUsuarios ] = useState([]);
    const [ usuario, setUsuario ] = useState(usuarioDefault);
    const [ spinner, mostrarSpinner, ocultarSpinner ] = useSpinner();
    const [ isOpen, openModal, closeModal ] = useModal();
    const [ isOpenModalEliminar, openModalEliminar, closeModalEliminar ] = useModal()
    

    useEffect(() => {
        listarUsuarios();
    }, []);

    const listarUsuarios = async () => {
        mostrarSpinner();

        const response = await AuthFetch('/User/listarUsuariosWeb')
        if (response.isValid) {
            setUsuarios(response.content)
        } else {
        }
        ocultarSpinner()
    }
    
    const obtenerUsuario = async (codUsuario) => {
        if (codUsuario){
            const response = await AuthFetch('​/User​/obtenerUsuarioPorCodUsuario?' + new URLSearchParams({
                codUsuario :codUsuario
            }),{
                method: 'GET',
            })
            setUsuario(response.content)
        }else{
            setUsuario(usuarioDefault);
        }
        openModal();
    }

    const usuarioEliminar = async (codUsuario) =>{
        if (codUsuario) {
            const response = await AuthFetch('​/User​/obtenerUsuarioPorCodUsuario?' + new URLSearchParams({
                CodUsuario : codUsuario
            }))
            if (response.isValid) {
                setUsuario(response.content);
            } else {
                notify(response.exceptions[0].description, 'error');
            }
        } else {
            setUsuario(usuarioDefault);
        }
        openModalEliminar();
    }

    const eliminarUsuario = async ()=>{
        const response = await AuthFetchOauth('/api/Manager/eliminarUsuario',{
            method:'POST',
            body: JSON.stringify({
                codUsuario: usuario.codUsuario,
                codUsuarioAccion: 1,
                motivo: usuario.motivo
            })
        })
        notify(response.isValid ? 'Se elimino el usuario Correctamente' : response.exceptions[0].description, response.isValid ? 'success' : 'error')
        if (response.isValid) {
            listarUsuarios()
        }
        closeModalEliminar()
    }

    const guardarEditarUsuario = async () => {
        const esGuardar = usuario.codUsuario <= 0;
        const response = await AuthFetchOauth(esGuardar?'/api/Manager/registrarUsuario':'/api/Manager/editarUsuario', {
                method: 'POST',
                body: JSON.stringify({
                ...(!esGuardar && { codUsuario: usuario.codUsuario }),
                nomUsuario:usuario.nomUsuario,
                codUsuarioAccion: 1,
                correoActual: usuario.correoPrincipal,
                clave: usuario.clave,
                ...(esGuardar && {codPersona: usuario.codPersona})
            }),

        });
        notify(response.isValid ? esGuardar ? 'El usuario se registro correctamente':'El usuario se editó correctamente' : response.exceptions[0].description, response.isValid ? 'success' : 'error')
    
        if (response.isValid) {
            setUsuario(usuarioDefault);
            await listarUsuarios();
            closeModal()
        }else{
            notify(response.exceptions[0].description,'error')
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
    return {usuarios, listarUsuarios,usuario,editarValorUsuario,obtenerUsuario, spinner,isOpen, closeModal, isOpenModalEliminar, closeModalEliminar,guardarEditarUsuario,usuarioEliminar,eliminarUsuario };
}