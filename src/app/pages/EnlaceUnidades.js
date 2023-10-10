import React, { useState, useEffect, useReducer, useMemo, useRef, useContext } from 'react';
import { formatState } from '../../utils/utils';
import { ContenedorParametros } from '../components/utils/ContenedorParametros';
import { BotonProcesar } from '../components/buttons/BotonProcesar';
import { Modal } from '../components/modal/Modal';
import { useModal } from '../../hooks/useModal';
import { useSpinner } from '../../hooks/useSpinner';
import { useEmpresas } from '../../hooks/useEmpresas';
import { Tooltip } from '../components/utils/Tooltip';
import { AuthFetch } from '../../services/api';
import { AuthFetchAtu } from '../../services/api';
import { notify } from '../../utils/utils';
import { UserContext } from '../../../src/context/provider/UserProvider';


const urlBase = process.env.REACT_APP_BEEDRONE_WEB_API;
const classNameInput = "text-white h-[30px] rounded px-4 bg-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
const seleccionTipo = {
    CAMBIAR_VALOR:'CAMBIAR_VALOR'
}

const estadoInical = {
    codEmpresa: 0,
    codRuta: 0,
    codUnidad: 0
}

const unidadesPorEmpresasReducer = (state, action) =>{
    switch(action.type){
        case seleccionTipo.CAMBIAR_VALOR:
            const {key, value} =action.payload;
            return{
                ...state,
                [key]: value
            }
        default:
            throw new Error('Not Implemented')
    }
}

const useUnidadesPorEmpresas = () =>{
    const [state, dispatch] = useReducer(unidadesPorEmpresasReducer, estadoInical);
    const [empresas, rutas, obtenerEmpresas, obtenerRutas, listarUnidades,unidades,unidad,obtenerUnidad,qrUrl,isOpen,closeModal,obtenerUnidadAtu,isOpen5,closeModal5] = useEmpresas()
    useMemo(()=>{
        obtenerEmpresas();
    },[])

    useMemo(()=>{
        if (state.codEmpresa === 0){
            dispatch({ type: seleccionTipo.CAMBIAR_VALOR, payload:{key:'codRuta', value:0}})
        }
        obtenerRutas(Number(state.codEmpresa));
    },[state.codEmpresa])

    return {state,dispatch,empresas,rutas, listarUnidades,unidades,unidad,obtenerUnidad,qrUrl,isOpen,closeModal,obtenerUnidadAtu,isOpen5,closeModal5}
}

export const EnlaceUnidades =()=>{
    const { stateUser, signOut } = useContext(UserContext)
    // const [isOpen, openModal, closeModal] = useModal();
    const printRef = useRef();
    const [isOpen2, openModal2, closeModal2] = useModal()
    const [isOpen3, openModal3, closeModal3] = useModal()
    //MODAL PARA CAMBIAR ESTADO DE QR ATU
    const [isOpen4, openModal4, closeModal4] = useModal()
    //MODAL PARA MOSTRAR DATOS DE QR ATU
    //const [isOpen5, openModal5, closeModal5] = useModal()

    const [spinner, mostrarSpinner,ocultarSpinner] = useSpinner()
    const [cargando, setCargando] = useState(false)
    const { state, dispatch, empresas, rutas,listarUnidades, unidades,unidad,obtenerUnidad,qrUrl,isOpen,closeModal,obtenerUnidadAtu,isOpen5,closeModal5} = useUnidadesPorEmpresas();
    const generarQr = async(unidad) =>{
        setCargando(true)
        const response = await AuthFetch('/Qr/generarQr',{
            method : 'POST',
            body : JSON.stringify({
                codigoEmpresa: unidad.codEmpresa,
                codigoRuta:unidad.codRuta,
                codigoUnidad: unidad.codUnidad
            })
        })

        notify((response.isValid ? response.content : response.exceptions[0].description), (response.isValid ? 'success' : 'error'))
        setCargando(false)
        listarUnidades(objCambiarEstado.codEmpresa,0);
    }
//GENERAR CODIGO QR ATU
    const generarQrAtu = async(unidad) =>{
        setCargando(true)
        const response = await AuthFetchAtu('/Qr/generarQrAtu',{
            method : 'POST',
            body : JSON.stringify({
                codEmpresa: unidad.codEmpresa,
                codUnidad: unidad.codUnidad,
                codQrTipo: 2,
                codUsuarioOauthCreacion: stateUser.codUsuario,
                nomPersonaOauthCreacion: stateUser.nombre,
                apePatPesonaOauthCreacion: stateUser.apellidoPaterno,
                apeMatPesonaOauthCreacion: stateUser.apellidoMaterno
            })
        })

        notify((response.isValid ? response.content : response.exceptions[0].description), (response.isValid ? 'success' : 'error'))
        setCargando(false)
        listarUnidades(objCambiarEstado.codEmpresa,0);
    }


    
    const objCambiarEstadoDefault = {
        codEmpresa:0,
        codUnidad:0,
        accionQrBeex:0
    }

    const [objCambiarEstado, setObjCambiarEstado ] =  useState(objCambiarEstadoDefault)

    const cambiarEstadoUnidad = (codEmpresa, codUnidad, codEstado)=>{
        objCambiarEstado.codEmpresa = codEmpresa
        objCambiarEstado.codUnidad = codUnidad
        objCambiarEstado.accionQrBeex = codEstado? 0 : 1
        openModal2()
    }

    //CAMBIO DE ESTADO ATU
    const cambiarEstadoUnidadAtu = (codEmpresa, codUnidad, codEstado)=>{
        objCambiarEstado.codEmpresa = codEmpresa
        objCambiarEstado.codUnidad = codUnidad
        objCambiarEstado.accionQrAtu = codEstado? 0 : 1
        openModal4()
    }

    

    const guardarNuevoEstado  = async ()=>{
        const response = await AuthFetch('/Qr/actualizaQrBeex?' + new URLSearchParams({
            codEmpresa: objCambiarEstado.codEmpresa,
            codUnidad: objCambiarEstado.codUnidad,
            accionQrBeex: objCambiarEstado.accionQrBeex
        }),{
            method:'PUT'
        })

        notify((response.isValid ? response.content : response.exceptions[0].description),(response.isValid ? 'success' : 'error') )
        closeModal2()
        response.isValid && listarUnidades(objCambiarEstado.codEmpresa,0)
    }

    //GUARDAR EL NUEVO ESTADO DEL QR ATU
    const guardarNuevoEstadoAtu  = async ()=>{
        const response = await AuthFetchAtu('/Qr/actualizaQrAtu?',{
            method : 'PUT',
            body : JSON.stringify({
                codEmpresa: objCambiarEstado.codEmpresa,
                codUnidad: objCambiarEstado.codUnidad,
                accionQr: objCambiarEstado.accionQrAtu,
                codQrTipo: 2,
                codUsuarioOauthCreacion: stateUser.codUsuario,
                nomPersonaOauthCreacion: stateUser.nombre,
                apePatPesonaOauthCreacion: stateUser.apellidoPaterno,
                apeMatPesonaOauthCreacion: stateUser.apellidoMaterno
            })
        })


        notify((response.isValid ? response.content : response.exceptions[0].description),(response.isValid ? 'success' : 'error') )
        closeModal4()
        response.isValid && listarUnidades(objCambiarEstado.codEmpresa,0)
    }

    const printDiv = () => {
        var divContents = printRef.current.innerHTML;
        var a = window.open('', '', 'height=400px, width=600px');
        // a.document.write('<html><body>');
        // a.document.write('<div>')
        a.document.write(divContents);
        // a.document.write('</div>')
        // a.document.write('</body></html>');
        a.document.close();

        setTimeout(() => {
            a.print();
        }, 2000)
    }

        return (
            <>
                <ContenedorParametros titulo='Enlace Unidades'>
                    <i className='fa fa-bus'/>

                    <select className={`${classNameInput}`} value={state.codEmpresa} onChange={(e) => dispatch({type: seleccionTipo.CAMBIAR_VALOR,payload: {key:'codEmpresa',value:Number(e.target.value)}})}>
                        <option value="0">-- Seleccione --</option>
                        {
                            empresas.map(e => {
                                return <option key={e.codEmpresa} value={e.codEmpresa}>{e.nomEmpresa}</option>
                            })
                        }
                    </select>

                    <i className='fa fa-road'/>
                    <select className={`${classNameInput}`} value={state.codRuta} onChange={(e) => dispatch({type: seleccionTipo.CAMBIAR_VALOR,payload: {key:'codRuta',value:Number(e.target.value)}})}>
                        <option value={0}>-- Todos --</option>
                        {
                            rutas.map((ruta)=>{
                                return <option key={ruta.codRuta} value={ruta.codRuta}>{ruta.nomRuta}</option>
                            })
                        }
                    </select>
                    <BotonProcesar onClick={()=>listarUnidades(state.codEmpresa, state.codRuta)} />
                </ContenedorParametros>

                <div className=" containerScroll mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla">
                            <div className= {` ${cargando? '  ': ' hidden '}  ml-[500px]  relative`}>
                                <div className="absolute z-113212110 loading">Generando QR...
                                    <div className="spinner-sec spin-sec-one"></div>
                                    <div className="spinner-sec spin-sec-two"></div>
                                    <div className="spinner-sec spin-sec-three"></div>
                                </div>
                            </div>
                        <table className="table">
                        <thead>
                            <tr>
                                <th className="w-[40px]">N</th>
                                <th className="w-[40px]">COD</th>
                                <th>UNIDAD</th>
                                <th className='w-[40px]'>GPS</th>
                                <th>MPOS</th>
                                <th>FECHA ENLACE</th>
                                <th>CODIGO QR</th>
                                <th>USUARIO ENLACE</th>
                                <th className="w-[120px]">ESTADO BEEX</th>
                                <th className='w-[40px]'>BEEX</th>
                                <th className="w-[120px]">ESTADO ATU</th>
                                <th className='w-[40px]'>ATU</th>
                                {/* <th className='w-[40px]'></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                unidades.length > 0 ?
                                unidades.map((unidad, i) =>{
                                    return (
                                        <tr key={unidad.codUnidad}>
                                                <td>{++i}</td>
                                                <td className="text-center">{unidad.codUnidad}</td>
                                                <td className="text-center">{unidad.unidad}</td>
                                                <td className="text-center">{unidad.tieneGPS? <i className='fa fa-check text-blue-300 '/> : ' '}</td>
                                                <td className="text-center" >{unidad.tieneValidador? <i className='fa fa-check text-blue-300 '/> : ' '}</td>
                                                <td className="text-center" >{unidad.fechaHoraCreacion}</td>
                                                <td className="text-center" >{unidad.codUnidadQrBeex}</td>
                                                <td className="max-w-[140px]"  >{unidad.nomPersonaCreacion}</td>
                                                <td className="text-center"  onClick={(e)=>cambiarEstadoUnidad(unidad.codEmpresa, unidad.codUnidad, unidad.activoQrBeex? 1 : 0 )}>{unidad.activoQrBeex}<span className={formatState(unidad.activoQrBeex ? 4 : 7)}>{unidad.activoQrBeex ? 'ACTIVO' : 'INACTIVO'}</span>
                                                </td>
                                                <td>
                                                    { unidad.activoQrBeex ?
                                                        <>
                                                        <button data-tip data-for={'id-tooltip-' + unidad.codUnidad} onClick={()=>obtenerUnidad(unidad.codEmpresa,unidad.codUnidad)} className="bg-blue-500 hover:bg-blue-600 text-[18px] px-[4px] py-0 rounded">
                                                        <i className="fas fa-qrcode"></i>
                                                            </button>
                                                            <Tooltip id={'id-tooltip-' + unidad.codUnidad}>
                                                                {`VER QR`}
                                                            </Tooltip>
                                                        </>:
                                                        <>
                                                            <button data-tip data-for={'id-tooltip-' + unidad.codUnidad} onClick={()=> generarQr(unidad)} className="bg-black-500 hover:bg-blue-700 text-[18px] px-[4px] py-0 rounded">
                                                                <i className="fas fa-qrcode"></i>
                                                            </button>
                                                            <Tooltip id={'id-tooltip-' + unidad.codUnidad}>
                                                                {`Generar QR`}
                                                            </Tooltip>
                                                        </>
                                                    }

                                                    

                                                </td>

                                                <td className="text-center"  onClick={(e)=>cambiarEstadoUnidadAtu(unidad.codEmpresa, unidad.codUnidad, unidad.activoQrATU? 1 : 0 )}>{unidad.activoQrATU}<span className={formatState(unidad.activoQrATU ? 4 : 7)}>{unidad.activoQrATU ? 'ACTIVO' : 'INACTIVO'}</span>
                                                </td>
                                                
                                                <td>
                                                    { unidad.activoQrATU ? //IDENTIFICAAR SI TIENE EL QR DE VEHÍCULO
                                                        <>
                                                        <button data-tip data-for={'id-tooltipV-' + unidad.codUnidad} onClick={()=>obtenerUnidadAtu(unidad.codEmpresa,unidad.codUnidad)} className="bg-blue-500 hover:bg-blue-600 text-[18px] px-[4px] py-0 rounded">
                                                        <i className="fas fa-qrcode"></i>
                                                            </button>
                                                            <Tooltip id={'id-tooltipV-' + unidad.codUnidad}>
                                                                {`Ver QR Atu`}
                                                            </Tooltip>
                                                        </>:
                                                        <>
                                                            <button data-tip data-for={'id-tooltipV-' + unidad.codUnidad} onClick={()=> generarQrAtu(unidad)} className="bg-black-500 hover:bg-blue-700 text-[18px] px-[4px] py-0 rounded">
                                                                <i className="fas fa-qrcode"></i>
                                                            </button>
                                                            <Tooltip id={'id-tooltipV-' + unidad.codUnidad}>
                                                                {`Generar QR Atu`}
                                                            </Tooltip>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                :<tr><td colSpan="12" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                            }
                        </tbody>
                        </table>
                </div>

                <Modal isOpen={isOpen} closeModal={closeModal} title= {`Detalles de QR BEEX`} >
                    <div className="w-[600px] flex gap-1 items-center  justify-center">
                        <div className='w-[300px]' >
                            <div className=" justify-center  w-full form-content rounded" style={{border:'solid 1px gray'}}>
                                <center><label className='underline text-xl '>Detalle del QR BEEX</label></center>
                                <div className='ml-5 mt-3'>
                                    <label className='text-xl'><i data-tip data-for='EMPRESA' className='mr-2 fa fa-bus'/>{unidad.nomEmpresa}<Tooltip id='EMPRESA'>{`EMPRESA`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='RUTA' className='mr-2 fa fa-road'/>{unidad.nomRuta}<Tooltip id='RUTA'>{`RUTA`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='PLACA' className='mr-2 fa fa-imdb'/> {`${unidad.padronUnidad} - ${unidad.placaUnidad}`}<Tooltip id='PLACA'>{`PADRON - PLACA`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='FECHA' className='mr-2 fa fa-calendar'/> {unidad.fechaHoraCreacion}<Tooltip id='FECHA'>{`FECHA ENLACE`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='USUARIO' className='mr-2 fa fa-user'/> {unidad.nomPersonaCreacion}<Tooltip id='USUARIO'>{`USUARIO ENLACE`}</Tooltip></label>
                                </div>
                            </div>
                        </div>

                        <div  className="print-mount rounded w-[300px] h-[300px] relative" style={{border: '1px solid gray'}}>
                            <button data-tip data-for='VERFOTO' className='absolute right-0 bottom-0 bg-blue-500 hover:bg-blue-700 text-xl rounded' style={{zIndex:'100000'}}>
                                <a className="m-1 fa fa-search-plus" target="_blank" href={qrUrl}></a>
                            </button>
                            <Tooltip id='VERFOTO'>{`Ampliar`}</Tooltip>
                            <div ref={{}}><img src={qrUrl}  className="w-[300px] h-[300px]  flex rounded h-full w-full" alt="sin imagen"/></div>
                            <button className='w-[200px] h-[50px]'  onClick={openModal3}> Vista Previa  </button>
                        </div>
                    </div>
                </Modal>
                
                <Modal isOpen={isOpen5} closeModal={closeModal5} action={console.log('entra modal5 atu')} title= {`Detalles de QR ATU`} >
                    <div className="w-[600px] flex gap-1 items-center  justify-center">
                        <div className='w-[300px]' >
                            <div className=" justify-center  w-full form-content rounded" style={{border:'solid 1px gray'}}>
                                <center><label className='underline text-xl '>Detalle del QR ATU</label></center>
                                <div className='ml-5 mt-3'>
                                    <label className='text-xl'><i data-tip data-for='EMPRESA' className='mr-2 fa fa-bus'/>{unidad.nomEmpresa}<Tooltip id='EMPRESA'>{`EMPRESA`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='RUTA' className='mr-2 fa fa-road'/>{unidad.nomRuta}<Tooltip id='RUTA'>{`RUTA`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='PLACA' className='mr-2 fa fa-imdb'/> {`${unidad.padronUnidad} - ${unidad.placaUnidad}`}<Tooltip id='PLACA'>{`PADRON - PLACA`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='FECHA' className='mr-2 fa fa-calendar'/> {unidad.fechaHoraCreacion}<Tooltip id='FECHA'>{`FECHA ENLACE`}</Tooltip></label>
                                </div>
                                <div className='ml-5'>
                                    <label className='text-xl'><i data-tip data-for='USUARIO' className='mr-2 fa fa-user'/> {unidad.nomPersonaCreacion}<Tooltip id='USUARIO'>{`USUARIO ENLACE`}</Tooltip></label>
                                </div>

                            </div>
                        </div>

                        <div  className="print-mount rounded w-[300px] h-[300px] relative" style={{border: '1px solid gray'}}>
                            <button data-tip data-for='VERFOTO' className='absolute right-0 bottom-0 bg-blue-500 hover:bg-blue-700 text-xl rounded' style={{zIndex:'100000'}}>
                                <a className="m-1 fa fa-search-plus" target="_blank" href={qrUrl}></a>
                            </button>
                            <Tooltip id='VERFOTO'>{`Ampliar`}</Tooltip>
                            <div ref={{}}><img src={qrUrl}  className="w-[300px] h-[300px]  flex rounded h-full w-full" alt="sin imagen"/></div>
                            <button className='w-[200px] h-[50px]'  onClick={openModal3}> Vista Previa  </button>
                        </div>
                    </div>
                </Modal>
                {/* IMPRESION CON TODO Y FONDO */}
                {/* <Modal
                    isOpen={isOpen3} closeModal={closeModal3} action={()=>printDiv()}
                    title= {'Vista Previa Impresion'}
                    spinner={spinner}
                    validButton = {{confirm: true, denied: true}}
                    textButtons={{confirm: 'Imprimir', denied: 'Cerrar'}}
                    >
                        <div ref={printRef}>
                            <div className="flex" style={{backgroundColor:'white', position:'relative'}}>

                                <img src={qrUrl} className='' style={{zIndex:'100000',marginLeft:'65px',marginTop:'190px', position:'absolute', width:'320px',height:'320px'}} alt=""/>
                                <label className="" style={{ position:'absolute',color:'white',marginLeft:'200px',marginTop:'512px', zIndex:'10000', fontFamily:'arial', fontSize:'20px'}}>{unidad.nomFotoQrBeeX}</label>
                                <img src={FondoAcrilico} className="" style={{width:'439px',height:'709px'}} alt="" />&nbsp;&nbsp;&nbsp;

                                <img src={qrUrl} className='' style={{zIndex:'100000',marginLeft:'65px',marginTop:'190px', position:'absolute', width:'320px',height:'320px'}} alt=""/>
                                <label className="" style={{ position:'absolute',color:'white',marginLeft:'200px',marginTop:'512px', zIndex:'10000', fontFamily:'arial', fontSize:'20px'}}>{unidad.nomFotoQrBeeX}</label>
                                <img src={FondoAcrilico} className="" style={{width:'439px',height:'709px'}} alt="" />

                            </div>
                        </div>
                </Modal> */}

                <Modal
                    isOpen={isOpen3} closeModal={closeModal3} action={()=>printDiv()}
                    title= {'Vista Previa Impresion 5 '}
                    spinner={spinner}
                    validButton = {{confirm: true, denied: true}}
                    textButtons={{confirm: 'Imprimir', denied: 'Cerrar'}}
                    >
                        <div ref={printRef} className='hidden' >
                        <div id="impresionSalidaConsumoInterno" style={{display:"none",paddingLeft:"7.5em" ,fontFamily:"Helvetica,Arial,sans-serif"}}>
    <div style={{display:"flex",flexDirection:"column",width:"390px",marginBottom:"300px"}}>
        <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1px"}}>
            <table class="fuente-ticket" style={{textAlign:"center",borderBottom:"0px solid black"}}>
                <tr>
                    <td id="txtRucInterno" class="textContenedores" style={{fontWeight:"100"}}></td>
                </tr>
                <tr>
                    <td class="textContenedoresInterno" style={{fontWeight:"bold"}}>SALIDA CONSUMO</td>
                </tr>
                <tr>
                    <td id="tdCodigoPecosaInterno" class="textContenedores"></td>
                </tr>
            </table>
        </div>
        <div class="fuente-ticket" style={{marginBottom:"10px",display:"flex",flexDirection:"column",border:"0px solid #000"}}>
            <div style={{border:"0px solid black",borderTop:"3px double black",color:"black"}}>
                <table class="txtFontPDF fuente-ticket">
                    <tr>
                        <td colspan="4" style={{textalign:"center",fontweight:"bold",borderbottom:"1px solid black"}}>DATOS USUARIO</td>
                    </tr>
                    <tr>
                        <td width="0.5cm"></td>
                        <td>U.Registro</td><td>:</td>
                        <td style={{width:"500px"}} id="UsuRegistroInterno"></td>
                    </tr>
                    <tr>
                        <td width="0.5cm"></td>
                        <td>F.Registro</td><td>:</td>
                        <td style={{width:"500px"}} id="FechaDUInterno"></td>
                    </tr>
                    <tr>
                        <td width="0.5cm"></td>
                        <td>Almacen</td><td>:</td>
                        <td style={{width:"500px"}} id="AlmacenDUInterno"></td>
                    </tr>
                </table>
            </div>
            
        </div>
       
    </div>
</div>
                           















                        </div>
                </Modal>

                <Modal
                    isOpen={isOpen2} closeModal={closeModal2} action={guardarNuevoEstado}
                    title= {objCambiarEstado.accionQrBeex? 'Habilitar el QR en la Unidad' : 'Deshabilitar el QR de la Unidad'}
                    spinner={spinner}
                    textButtons={{ confirm: 'Si', denied: 'No' }}
                    >
                    <div className="flex gap-8 items-center flex-wrap justify-center">      
                        <div className="w-[400px] px-4">
                            <label className="text-center">{objCambiarEstado.accionQrBeex? '¿Esta seguro que desea Habilitar el QR en la Unidad?' : '¿Esta seguro que desea Deshabilitar el QR en la Unidad?'}</label>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={isOpen4} closeModal={closeModal4} action={guardarNuevoEstadoAtu}
                    title= {objCambiarEstado.accionQrAtu? 'Habilitar el QR Atu en la Unidad' : 'Deshabilitar el QR Atu de la Unidad'}
                    spinner={spinner}
                    textButtons={{ confirm: 'Si', denied: 'No' }}
                    >
                    <div className="flex gap-8 items-center flex-wrap justify-center">      
                        <div className="w-[400px] px-4">
                            <label className="text-center">{objCambiarEstado.accionQrAtu? '¿Esta seguro que desea Habilitar el QR Atu en la Unidad?' : '¿Esta seguro que desea Deshabilitar el QR Atu en la Unidad?'}</label>
                        </div>
                    </div>
                </Modal>
            </>
    )
}