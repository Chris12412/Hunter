import { useState, useEffect } from 'react';
import { notify } from '../utils/utils';
import { useModal } from '../hooks/useModal';
import { AuthFetch, AuthFetchOauth, Fetch } from '../services/api';

const personaDefault = {
    codPersona: 0,
    nomPersona: '',
    apellidoPat: '',
    apellidoMat: '',
    codDocumentoTipo: 1,
    numDocumento: '',
    telefonoActual:'',
    codUsuarioAccion:0,
    codEstado:0,
    motivoEliminacion:'',
    nomEstado:''
}

// const urlBasePlamin = process.env.REACT_APP_PLAMIN_API + "/api";

export const usePersonas = () => {
    const [ personas, setPersonas ] = useState([]);
    const [ persona, setPersona ] = useState(personaDefault);
    const [ isOpenModal, openModal, closeModal ] = useModal();
    const [ isOpenModalEliminar, openModalEliminar, closeModalEliminar ] = useModal();
    const [ personasCombo, setPersonasCombo ] = useState()
    
    const cargarDatosPersona = async () => {
        const response = await Fetch({url :'https://identidadwebapi.abexacloud.com/api/Identidad/obtenerDni?'+ new URLSearchParams({dni: persona.numDocumento,}),})
        
        if(response.isValid){
            const personaMostrar = {
                codPersona: 0,
                nomPersona: response.content.nombres,
                apellidoPat: response.content.apellidoPaterno,
                apellidoMat: response.content.apellidoMaterno,
                codDocumentoTipo: 1,
                numDocumento: response.content.dni,
                telefonoActual:'',
                codUsuarioAccion:0,
                codEstado:0,
                motivoEliminacion:'',
                nomEstado:''
            }
            setPersona(personaMostrar)
        }else{
            setPersona(personaDefault)
            notify('Error al traer datos por DNI','error');
        }
    }

    useEffect(() => {
        listarPersonas();
        listarPersonasCombo();
        // cargarDatosPersona()
    }, []);

    const listarPersonas = async () => {
        const response = await AuthFetchOauth('/api/Manager/listarPersonas')
        if(response.isValid){
            setPersonas(response.content)
        }else{
            notify(response.exceptions[0].description, 'error');
        }
    }
    
    const listarPersonasCombo = async () => {
        const response = await AuthFetchOauth('/api/Manager/listarPersonasCombo')
        if(response.isValid){
            setPersonasCombo(response.content)
        }else{
            notify(response.exceptions[0].description, 'error');
        }
    }

    const obtenerPersona = async (codPersona) => {
        if (codPersona) {
            const response = await AuthFetchOauth('/api/Manager/obtenerPersona?' + new URLSearchParams({
                CodPersona : codPersona
            }))
            if (response.isValid) {
                setPersona(response.content);
            } else {
                notify(response.content, 'error');
            }
        } else {
            setPersona(personaDefault);
        }
        openModal();
    }

    
    const personaEliminar = async (codPersona) =>{
        if (codPersona) {
            const response = await AuthFetchOauth('/api/Manager/obtenerPersona?' + new URLSearchParams({
                CodPersona : codPersona
            }))
            if (response.isValid) {
                setPersona(response.content);
            } else {
                notify(response.exceptions[0].description, 'error');
            }
        } else {
            setPersona(personaDefault);
        }
        openModalEliminar();
    }


    const eliminarPersona = async ()=>{
        const response = await AuthFetchOauth('/api/Manager/EliminarPersona',{
            method:'POST',
            body: JSON.stringify({
            codPersona:persona.codPersona,
            codUsuarioAccion: 1,
            motivoEliminacion: persona.motivoEliminacion
            })
        })
        notify(response.isValid ? 'Se elimino la persona Correctamente' : response.exceptions[0].description, response.isValid ? 'success' : 'error')
        if (response.isValid) {
            listarPersonas()
        }
        closeModalEliminar()
    }

    // https://atu.api.plaminoficial.com/api/Qr/listaEntidadBancaria

    
        const guardarEditarPersona = async () => {
        const esGuardar = persona.codPersona <= 0;
        const response = await AuthFetchOauth(esGuardar?'/api/Manager/registrarPersona':'/api/Manager/editarPersona', {
                method: 'POST',
                body: JSON.stringify({
                ...(!esGuardar && { codPersona: persona.codPersona }),
                nomPersona:persona.nomPersona,
                apellidoPat: persona.apellidoPat,
                apellidoMat:persona.apellidoMat,
                CodDocumentoTipo:persona.codDocumentoTipo,
                numDocumento:persona.numDocumento,
                telefonoActual:persona.telefonoActual,
                codUsuarioAccion:1,
                ...(!esGuardar && {codEstado:persona.codEstado})
            }),
        });
        notify(response.isValid ? esGuardar ? 'La persona se registro con correctamente':'La persona se editó correctamente' : response.exceptions[0].description, response.isValid ? 'success' : 'error')
        if (response.isValid) {
            setPersona(personaDefault);
            await listarPersonas();
            closeModal()
        }
    }

    const editarValorPersona = (key, value) => {
        // console.log("Editar Persona: " , key , value)
        setPersona(persona => {
            return {
                ...persona,
                [key]: value
            }
        });
    }

    return { personas, listarPersonas, guardarEditarPersona, persona, editarValorPersona, obtenerPersona, isOpenModal, closeModal, cargarDatosPersona,eliminarPersona, isOpenModalEliminar, closeModalEliminar, personaEliminar,listarPersonasCombo,personasCombo }
}