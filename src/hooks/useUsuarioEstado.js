import { useState  } from 'react';
import { AuthFetch } from '../services/api';
import { notify } from '../utils/utils';

export const useUsuarioEstado = () => {
    const usuarioEstadoDefault={
        codUsuario: 0,
        fechaHoraFin: '',
        codPeticion: 0,
        concatenadoUsuarioEstado: '',
        motivo : '',
        amonestado : 0,
        bloqueado : 0
    }
    const [usuarioEstado, setUsuarioEstado] = useState(usuarioEstadoDefault)
    
    
    const registrarUsuarioEstado = async () => {
        const amonestacion = usuarioEstado.amonestado === 0 ? '' : `${usuarioEstado.motivo},${usuarioEstado.amonestado} ` 
        const bloqueo = usuarioEstado.bloqueado === 0 ? '' : `${usuarioEstado.motivo},${usuarioEstado.bloqueado} `
        let concatenadoUsuarios = ''
            if (amonestacion !== ''){
                bloqueo !== '' ? concatenadoUsuarios = `${amonestacion}*${bloqueo}` : concatenadoUsuarios = `${amonestacion}`
            }else {
                bloqueo !== '' ? concatenadoUsuarios = `${bloqueo}` : concatenadoUsuarios = ``   
            }

        const response = await AuthFetch(`/User/generarFaltaUsuario`, {
            method: 'POST',
            body: JSON.stringify({
                codUsuario:usuarioEstado.codUsuario,
                fechaHoraFin: usuarioEstado.fechaHoraFin,
                codPeticion: usuarioEstado.codPeticion,
                concatenadoUsuarioEstado: concatenadoUsuarios
            }),
        })
        if (response.isValid) {
            notify('Se genero la Amonestación / Solicitud de Bloqueo correctamente', 'success')
        }else {
            notify(response.exceptions[0].description, 'error')
        } 
    }
    
    const editarValorUsuarioEstado = (key,value) =>{
        setUsuarioEstado(usuarioEstado => {
            return {
                ...usuarioEstado,
                [key]: value
            }
        });
    }     
    
    return {registrarUsuarioEstado, editarValorUsuarioEstado, usuarioEstado};
}
