import { useState, useEffect } from 'react';
import { AuthFetch } from '../services/api';
import { AuthFetchAtu } from '../services/api';
import { notify } from '../utils/utils';
import { useModal } from './useModal';
import QrDefault from '../assets/images/QRDefault.jpg'

const unidadDefault ={
    codEmpresa: 0,
    nomEmpresa: '',
    nomRuta: '',
    padronUnidad: '',
    placaUnidad: '',
    codRuta: 0,
    codUnidad: 0,
    unidad: '',
    tieneGPS: true,
    tieneValidador: true,
    activoQrBeex: true,
    codUnidadQrBeex: 0,
    fechaHoraCreacion: '',
    nomPersonaCreacion: '',
    nomFotoQrBeeX: '',
    nomCarpetaQrBeex: ''
}
const urlBase = process.env.REACT_APP_BEEDRONE_WEB_API;
const urlBaseMinio = process.env.REACT_APP_BEEDRONE_WEB_API_MINIO;

export const useEmpresas = () => {
    const [ empresas, setEmpresas ] = useState([]);
    const [ rutas, setRutas ] = useState([]);
    const [ unidades, setUnidades ] = useState([]);
    const [ unidad, setUnidad] = useState(unidadDefault)
    const [ isOpen, openModal, closeModal] = useModal();
    const [ isOpen5, openModal5, closeModal5] = useModal();
    const [ qrUrl, setQrUrl ] = useState(QrDefault);
    
    useEffect(() => {
        obtenerEmpresas();
    }, []);

    const obtenerEmpresas = async () => {
        const response = await AuthFetch('/Qr/obtenerListaEmpresas')
        if (response.isValid) {
            setEmpresas(response.content)
        }
    }

    const obtenerRutas = async (codEmpresa) => {
        if (codEmpresa){
            const response = await AuthFetch(`/Qr/obtenerListaRutas?` + new URLSearchParams({
                codEmpresa: codEmpresa
            }))
            if (response.isValid){
                setRutas(response.content)
            }
        }
    }

    const listarUnidades = async (codEmpresa,codRuta) => {
        if(codEmpresa){
            const response = await AuthFetchAtu('/Qr/obtenerListaUnidades?' + new URLSearchParams({
                codEmpresa: codEmpresa,
                codRuta: codRuta
        }))
            if(response.isValid){
                setUnidades(response.content)
            }else{
                alert('hubo un problema')
                setUnidades([])
            }
        }
    }

    //SE CAMBIO LA URL
    const verQr = (nomCarpeta,nombreFoto) => {
        setQrUrl(`${urlBaseMinio}/Archivo/verImagen?NombreCarpeta=${nomCarpeta}&NombreImagen=${nombreFoto}`);//AUTOMATICO
    }

    const obtenerUnidad = async (codEmpresa,codUnidad) => {
        const response = await AuthFetch('/Qr/obtenerUnidad?' + new URLSearchParams({
            codEmpresa: codEmpresa,
            codUnidad: codUnidad
        }))
        
        if (response.isValid === true){
            setUnidad(response.content)
            verQr(response.content.nomCarpetaQrBeex,response.content.nomFotoQrBeeX)
            openModal()
        }else{
            notify(response.exceptions[0].description,'error')
            setUnidad(unidadDefault)
        }
    }

    //OBTENER UNIDAD (DATOS) PARA EL QR DE ATU VEHÍCULO
    const obtenerUnidadAtu = async (codEmpresa,codUnidad) => {
        const response = await AuthFetchAtu('/Qr/obtenerUnidadAtu?' + new URLSearchParams({
            codEmpresa: codEmpresa,
            codUnidad: codUnidad
        }))
        
        if (response.isValid === true){
            setUnidad(response.content)
            verQr(response.content.nomCarpetaQrATU,response.content.nomFotoQrATU)
            openModal5()
        }else{
            notify(response.exceptions[0].description,'error')
            setUnidad(unidadDefault)
        }
    }

    return [ empresas,rutas,obtenerEmpresas,obtenerRutas, listarUnidades,unidades,unidad,obtenerUnidad,qrUrl,isOpen,closeModal,obtenerUnidadAtu,isOpen5,closeModal5];
}

