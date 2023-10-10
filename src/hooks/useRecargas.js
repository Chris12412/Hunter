import { useState, useEffect,useRef,useContext} from 'react';
import '../assets/css/views/recargas.css'
import { useModal } from '../hooks/useModal'
import { useSpinner } from '../hooks/useSpinner'
import { AuthFetch, Fetch } from '../services/api'
import { formatDate, notify, soloDecimal, formatState,formatoNombre } from '../utils/utils'
import imagenDefault from '../assets/images/sinImagen.PNG'
import { useUsuarioEstado } from './useUsuarioEstado';
import { UserContext } from "../context/provider/UserProvider";




const urlBase = process.env.REACT_APP_BEEDRONE_WEB_API;

export const useRecargas = () => {
    // const { stateUser , signOut } = useContext();
    const fechaInicioHoy = new Date()
    const fechaFinHoy = new Date()
    const { stateUser , signOut } = useContext(UserContext);


    const recargaDefault = {
            codPeticion: 0,
            fechaOperacion: '',
            fechaHoraCreacion: '',
            codUsuario: 0,
            correoPrincipal: '',
            nomPersona: '',
            apePersona: '',
            numeroDocumento: '',
            numCelularPrincipal: '',
            codEntidadBancaria: 0,
            nomEntidadBancaria: '',
            comentario: '',
            montoVoucher: 0,
            numOperacion:'',            
            nomEstado: '',
            codEstado: 0,
            nomUsuario: '',
            nomVoucher: '',
            nomCarpetaVoucher: '',
            fechaHoraFin:'',
            sugerirBloqueo: 0,
            amonestarUsuario: 0,
            motivoAmonestacionBloqueo:'',
            numMensajePendiente:0

    }

    ///Nuevo 50
    //Aceptado 52
    //Denegado 53
    
    const [ estadoBotonPintar, setEstadoBotonPintar ] = useState(50)
    const [ recargas, setRecargas ] = useState([]);
    const [ recarga, setRecarga ] = useState(recargaDefault);
    const [ spinner, mostrarSpinner, ocultarSpinner ] = useSpinner();
    const [ isOpen, openModal, closeModal ] = useModal();
    const [ isOpenAmonestarBloquear, openModalAmonestarBloquear,closeModalAmonestarBloquear ] = useModal()
    const [ bancos, setBancos ] = useState([]);

    useEffect(() => {
        listarRecargas(fechaInicioHoy,fechaFinHoy,50);
        listarEntidadesBancarias();
    }, []);

    const listarRecargas = async (FechaInicio,FechaFin,estado) => {
        setEstadoBotonPintar(estado)
        mostrarSpinner();

        console.log("CODSESION -> ", stateUser.codSesion)
        const response = await AuthFetch('/Recharge/listaVouchers?' + new URLSearchParams({
            fechaInicio:formatDate(FechaInicio,23),
            // fechaFin:`${formatDate(FechaFin,23)}~${stateUser.codUsuario}`,
            fechaFin:formatDate(FechaFin,23),
            codEstado: estado  + "9999" + stateUser.codUsuario
        }), {
            method: 'GET'
        })
            if (response.isValid) {
                setRecargas(response.content)
            } else {
                notify('Hubo un problema al listar las recargas', 'error')
            }
        ocultarSpinner()

        // console.log("LISTAR RECARGAS -> ",formatDate(FechaInicio,23),formatDate(FechaFin,23),estado  + "9999" + stateUser.codUsuario)
    }

    const listarEntidadesBancarias = async ()=>{
        const response = await Fetch({url : 'https://atu.api.plaminoficial.com/api/Qr/listaEntidadBancaria'})
        if(response.isValid){
            setBancos(response.content)
        }else{
            notify(response.content, 'error');
        }
    }

    const envioDatosFaltantes = async ()=>{

        const response = await fetch('https://atu.api.plaminoficial.com/api/Qr/recargaUsuarioBeex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codPeticion: recarga.codPeticion, 
                fechaOperacion: recarga.fechaHoraCreacion,
                codEntidadBancaria: recarga.codEntidadBancaria,
                nroOperacion: recarga.numOperacion,  
            })
        }).then(res => res.json());
        
        if (response.isValid){
            // notify('Recarga Exitosa','success')
        }else{
            notify('No se pudo obtener los detalles de la Recarga','error')
        }
    }

    const obtenerRecarga = async (codPeticion) => {
        const response = await AuthFetch(`/Recharge/obtenerVoucherPorCodPeticion?codPeticion=${codPeticion}`, {
            method: 'GET',
        })
        
        if (response.isValid === true){
            setRecarga(response.content)
            verFoto(response.content.nomCarpetaVoucher,response.content.nomVoucher)
        }else{
            notify('No se pudo obtener los detalles de la Recarga','error')
            setRecarga(recargaDefault)
        }
        // openModal()
    }

    const [ fotoUrl, setFotoUrl ] = useState(imagenDefault);
    const verFoto = (nomCarpeta,nombreFoto) => {
        setFotoUrl(`${urlBase}/Minio?nombreCarpetaFoto=${nomCarpeta}&nombreFoto=${nombreFoto}`);//AUTOMATICO
    }

    const aceptarRecarga = async () =>{
        if(recarga.monto == 0 || recarga.numOperacion == "" || recarga.fechaHoraCreacion == "" || recarga.nomEntidadBancaria == 0 ){
            notify('Tiene que proporcionar todos los datos correctos' , 'error')
            return; 
        }

        mostrarSpinner()
        const response = await AuthFetch(`/Recharge/recargaUsuario`, {
            method: 'POST',
                body: JSON.stringify({
                    codUsuarioDestino: recarga.codUsuario,
                    monto: recarga.montoVoucher,
                    codPeticion: recarga.codPeticion 
                }),
        })
            ocultarSpinner()
            listarRecargas(fechaInicioHoy,fechaFinHoy,50)
            notify(response.isValid ? 'La recarga se realizó correctamente' : response.exceptions[0].description, response.isValid ? 'success' : 'error')
            if(response.isValid){
                envioDatosFaltantes()
                setEstadoBotonPintar(50)
                closeModal();
            }
    }
    
    const rechazarRecarga = async () =>{
        mostrarSpinner()
        if (recarga.amonestarUsuario || recarga.sugerirBloqueo){
            registrarUsuarioEstado()
        } 

        if(recarga.comentario === ''){
            notify('Debe ingresar un comentario válido', 'error') 
            ocultarSpinner()
            return
        }else{
            console.log("datos de la recarga rechazada ->  ", recarga)

            const response = await AuthFetch(`/Recharge/cancelarPedidoPorCodPeticion`, {
            method: 'POST',
            body: JSON.stringify({
                codUsuarioDestino: recarga.codUsuario,
                monto: recarga.montoVoucher,
                codPeticion: recarga.codPeticion,
                correoDestino: recarga.correoPrincipal,
                comentario: recarga.comentario,
            }),
        })
        if (response.isValid){
            notify(response.content,'success');
            listarRecargas(fechaInicioHoy,fechaFinHoy,50)
            setEstadoBotonPintar(50)
            closeModal()
            closeModalAmonestarBloquear()
        }else{
            notify(response.exceptions[0].description, 'error')
        }
        ocultarSpinner()
        }
    }
    
    const registrarUsuarioEstado = async () => {
        let concatenadoAmonestacion = `${recarga.motivoAmonestacionBloqueo}^5`
        let concatenadoBloqueo = `${recarga.motivoAmonestacionBloqueo}^1`
        let concatenadoFinal=''
        if (recarga.amonestarUsuario && recarga.sugerirBloqueo){
            concatenadoFinal = `${concatenadoAmonestacion}*${concatenadoBloqueo}`
        } else if (recarga.amonestarUsuario && recarga.sugerirBloqueo !==0){
            concatenadoFinal = `${concatenadoBloqueo}`
        } else if (recarga.amonestarUsuario !== 0 && recarga.sugerirBloqueo){
            concatenadoFinal = `${concatenadoAmonestacion}`
        } else if (recarga.amonestarUsuario !== 0 && recarga.sugerirBloqueo !== 0){
            concatenadoFinal = ''
        }
        
        const response = await AuthFetch(`/User/generarFaltaUsuario`, {
            method: 'POST',
            body: JSON.stringify({
                codUsuario:recarga.codUsuario,
                fechaHoraFin: recarga.fechaHoraFin,
                codPeticion: recarga.codPeticion,
                concatenadoUsuarioEstado: concatenadoFinal
            }),
        })
        if (response.isValid) {
            notify('Se genero la Amonestación - Solicitud de Bloqueo correctamente', 'success')
        }else {
            notify(response.exceptions[0].description, 'error')
        } 
    }
    
    const editarValorRecarga = (key,value) =>{

        setRecarga(recarga => {
            return {
                ...recarga,
                [key]: value
            }
        });
    }     
    return {recargas, listarRecargas, recarga, spinner,isOpen, closeModal,editarValorRecarga,obtenerRecarga,fotoUrl,estadoBotonPintar,setEstadoBotonPintar,aceptarRecarga,rechazarRecarga,isOpenAmonestarBloquear,openModalAmonestarBloquear,closeModalAmonestarBloquear,bancos,listarEntidadesBancarias};
}