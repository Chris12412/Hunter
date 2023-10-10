import { useState, useEffect } from 'react';
import { notify } from '../utils/utils';
import { AuthFetchAtu } from '../services/api';
import { useModal } from './useModal';
import { useSpinner } from "./useSpinner";

const reclamoDefault = {codReclamo:0,codUsuarioAtencion:0,detalleAtencion:''}
export const useLibroReclamaciones = () => {
    const [ reclamos, setReclamos ] = useState([]);
    const [reclamo, setReclamo] = useState(reclamoDefault)
    const [ isOpenModal, openModal, closeModal ] = useModal();
    const [ spinner, mostrarSpinner, ocultarSpinner ] = useSpinner();



    useEffect(() => {
        listarReclamos();
    }, []);

    const listarReclamos = async () => {
        const response = await AuthFetchAtu('/Reclamo')
        if(response.isValid){
            setReclamos(response.content)
        }else{
            notify(response.exceptions[0].description, 'error');
        }
    }
    const editarReclamo = async (key1,value1,key2,value2)=>{
        openModal();
        setReclamo(reclamo => {
            return{
                [key1]:value1,
                [key2]:value2
            }
        });
    }
    const editarValorReclamo = (key,value) =>{
        setReclamo(reclamo => {
            return {
                ... reclamo,
                [key]: value
            }
        });
    }
    const guardarEditarReclamo = async ()=>{
        const response = await AuthFetchAtu('/Reclamo', {
            method:'PUT',
            body: JSON.stringify({
              codReclamo:reclamo.codReclamo,
              codUsuarioAtencion:reclamo.codUsuarioAtencion,
              detalleAtencion:reclamo.detalleAtencion
            }),
          })
          notify(response.content, response.isValid ? 'success' : 'error');
          if(response.isValid == true){
            await listarReclamos();
            closeModal()
          }
    }


    return { reclamos ,listarReclamos, isOpenModal,closeModal,editarReclamo,editarValorReclamo,guardarEditarReclamo,spinner}
}