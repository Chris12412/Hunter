import { useState, useEffect } from 'react';
import { AuthFetch, AuthFetchOauth } from '../services/api';
import { notify } from '../utils/utils';
import { useModal } from './useModal';

export const useAmonestaciones = () => {
    const amonestacionDefault={
        codUsuario: 0,
        nomPersona: '',
        nomPersonaCreacion: '',
        fechaHoraInicio: '',
        fechaHoraFin: '',
        codUsuarioEstadoTipo: 0,
        nomUsuarioEstadoTipo:'',
        codPeticion: 0,
        motivoCreacion: ''
    }
    
    const [ amonestaciones, setAmonestaciones ] = useState([]);
    const [ isOpenModalAmonestaciones, openModalAmonestaciones, closeModalAmonestaciones ] = useModal(false)
    const [ isOpenModalBloqueos, openModalBloqueos, closeModalBloqueos ] = useModal(false)
    const [ amonestacion, setAmonestacion ] = useState(amonestacionDefault)
    const [ bloqueos, setBloqueos ] = useState([])
    
    const registrarUsuarioEstado = async (estado) =>{
        const response = await AuthFetch(`/User/generarFaltaUsuario`, {
            method: 'POST',
            body: JSON.stringify({
                codUsuario: amonestacion.codUsuario,
                fechaHoraFin: null,//fecha final del vencimiento del bloqueo
                codPeticion: amonestacion.codPeticion,
                concatenadoUsuarioEstado: amonestacion.motivoCreacion+'^'+estado
            }),
        })
        notify(response.isValid ? 'Se Bloqueo al Usuario Correctamente' : response.exceptions[0].description, response.isValid ? 'success' : 'error')
        closeModalBloqueos()
    }
        
    const RegistrarAmonestacion = async () =>{
        const response = await AuthFetch(`/User/generarFaltaUsuario`, {
            method: 'POST',
            body: JSON.stringify({
                codUsuario: amonestacion.codUsuario,
                fechaHoraFin: amonestacion.fechaHoraFin,
                codUsuarioEstadoTipo: amonestacion.codUsuarioEstadoTipo,
                motivoCreacion:amonestacion.motivoCreacion,
                codPeticion: amonestacion.codPeticion
            }),
        })
        if (response.isValid) {
            listarAmonestaciones()
        } 
    }
    
    const listarBloqueos = async (codUsuario) =>{
        const response = await AuthFetch('/User/listarBloqueos?' + new URLSearchParams({
            codUsuario : codUsuario,
        }),{
            method : 'GET'
        })
        if (response.isValid){
            openModalBloqueos()
            setBloqueos(response.content)
        }else{
            notify('No se pudo cargar el listado de Bloqueos','error')
        } 
    }   
    
    const listarAmonestaciones = async (codUsuario) => {
        openModalAmonestaciones()
        const response = await AuthFetch('/User/historialUsuario?' + new URLSearchParams({
            codUsuario: codUsuario,
        }), {
            method: 'GET'
        })
        if (response.isValid) {
            setAmonestaciones(response.content)
        } else {
            notify('No se pudo cargar el historial de amonestaciones', 'error')
        }
    }
    
    const editarValorAmonestacion = (key,value) =>{
        setAmonestacion(amonestacion => {
            return {
                ...amonestacion,
                [key]: value
            }
        });
    }     
    return {listarAmonestaciones, amonestaciones,RegistrarAmonestacion,editarValorAmonestacion, isOpenModalAmonestaciones, openModalAmonestaciones, closeModalAmonestaciones, bloqueos, listarBloqueos, isOpenModalBloqueos, closeModalBloqueos,registrarUsuarioEstado,amonestacion};
}