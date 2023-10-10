import React, { useState, useContext, useEffect,useRef } from 'react';
import '../../assets/css/chatEstilos.css'
import '../../assets/css/views/recargas.css'

import { Modal } from '../components/modal/Modal'
import { ModalRecarga } from '../components/modal/ModalRecarga';
import { DatePickerABX } from '../components/pickers/DatePicker'
import { BotonesEstado } from '../components/buttons/BotonEstado';
import { notify, soloDecimal, formatState } from '../../utils/utils'
import { SocketContext } from '../../context/provider/SocketProvider'
import { Tooltip } from '../components/utils/Tooltip';
import { ContenedorParametros } from '../components/utils/ContenedorParametros';
import { useRecargas } from '../../hooks/useRecargas';
import { useModal } from '../../hooks/useModal';
import sonidoRecarga from '../../assets/sound/sonidoRecarga.mp3'
import Tesseract from 'tesseract.js';
import { useHistorialRecargas } from '../../hooks/useHistorialRecargas';
import { useAmonestaciones } from '../../hooks/useAmonestaciones';
import { SearchTable } from '../components/utils/SearchTable';
import { UserContext } from '../../context/provider/UserProvider';
import { useChatOnline } from '../../hooks/useChatOnline';
import fotoChat from '../../../src/assets/images/fotousuarioBeex.fw.png'
import fotobeexserver from '../../../src/assets/images/fotousuarioBeexserver.fw.png'
import { id } from 'date-fns/locale';

// import io from "socket.io-client";
// const socket = io(process.env.REACT_APP_SOCKET_SESION);


// const socket = io("/");

export const Recargas = () => {
    
    
    const [cargando, setCargando] = useState(false)
    const {recargas, listarRecargas, recarga, spinner, isOpen, closeModal,editarValorRecarga,obtenerRecarga, fotoUrl, estadoBotonPintar, setEstadoBotonPintar, aceptarRecarga, rechazarRecarga, isOpenAmonestarBloquear, openModalAmonestarBloquear, closeModalAmonestarBloquear, bancos, listarEntidadesBancarias } = useRecargas();
    const { chat ,obtenerChat, isOpenChat, openModalChat, closeModalChat, editarValorChat, guardarEditarMensaje } = useChatOnline();

    const leerImagen =  (img) =>{
        setCargando(true)
        Tesseract.recognize(img,'spa',
            // { logger: m => console.log(m) } //
        ).then(({ data: {text}}) => {
            if (text !== ''){
                let ubicacionMonto = 0
                if (text.includes("$/")){
                    ubicacionMonto = text.indexOf('$/')
                }else if (text.includes("S/")){
                    ubicacionMonto = text.indexOf('S/')
                } 
                let nomEntidadBancaria = ''
                if(text.includes("interbank") || text.includes("Interbank")) {
                    nomEntidadBancaria= 'BANCO INTERBANK'
                    // editarValorRecarga('nomEntidadBancaria',banco)
                }else if (text.includes('BCP') || text.includes("VIABCP") ){
                    nomEntidadBancaria= 'BANCO BCP'
                    // editarValorRecarga('nomEntidadBancaria',banco)
                }else if (text.includes("BBVA") || text.includes("bbva") || text.includes("Bbva")){
                    nomEntidadBancaria = 'BANCO BBVA'
                    // editarValorRecarga('nomEntidadBancaria',banco)
                }else{
                    nomEntidadBancaria= "No se pudo Obtener"
                }
                
                let ubicacionNumOperacion = ''
                if (text.includes("Número de operación") ){
                    ubicacionNumOperacion = text.indexOf('Número de operación')
                }else if (text.includes("Código de operación")){
                    ubicacionNumOperacion = text.indexOf('Código de operación')
                } 


                const regex = /(\d+)/g;
                const monto = text.substring(ubicacionMonto + 2, ubicacionMonto + 10).replace(" ","").replace("'","")
                
                // const mon
                // const ubicacionNumOperacion =text.indexOf('AP')
                const numOperacion = text.substring(ubicacionNumOperacion + 19, ubicacionNumOperacion + 29 ).replace(":","")
                setCargando(false)
                editarValorRecarga('nomEntidadBancaria', nomEntidadBancaria)
                editarValorRecarga('montoVoucher', monto.replace(",","."))
                editarValorRecarga('numOperacion', numOperacion)
                notify('Monto: S/' + monto.match(regex) + ' Numero Operacion: ' + numOperacion + 'Banco: ' + nomEntidadBancaria,'success')

            }
        })
    }

    const audioRecarga = useRef(null);

    const classNameInput2 = "text-white h-[80px] rounded mt-[10px] px-4 w-full bg-zinc-900 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
    const classNameInput = " text-white h-[25px] rounded-lg mt-[10px] mr-[25px] px-3 w-[250px] text-[14px] bg-zinc-900 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
    const [ startDate, setStartDate ] = useState(new Date())
    const [ endDate, setEndDate ] = useState(new Date())
    const [comentarioBloqueo, setComentarioBloqueo] = useState(false)
    const { listarHistorialRecargas, recargaHistorial, isOpenHistorial, closeModalHistorial } = useHistorialRecargas()
    const { stateSocket } = useContext(SocketContext);
    const { stateUser, signIn } = useContext(UserContext);
    const [isOpenChatBeex, openModalChatBeex, closeModalChatBeex] = useModal()
    const [isOpenModalRecarga, openModalRecarga, closeModalRecarga] = useModal()
    const ultimoElementoRef = useRef(null);
    const idTablaRecargas = "tablaRecargas"
    useEffect(() => {
        listarRecargas(startDate,endDate,50);
    }, [startDate, endDate])
    
    useEffect(()=>{
        listarEntidadesBancarias()
    },[])

    useEffect(()=>{
        const usuarioSocket= {
            usuario : stateUser.nomUsuario.toUpperCase(),
            sesion : localStorage.getItem('sesion'),
            token: stateUser.token
        }
    },[])
    // useEffect(() => {
    //     console.log('ultimo elemento → ',ultimoElementoRef.current)
    //     //ultimoElementoRef.current?.focus();
    //   }, [chat]);
    useEffect(() => {
        if (Object.keys(stateSocket.payload).length > 0) {
            audioRecarga.current.play(); 
            if (stateSocket.payload.message.hd.cmd == "setNotificacionBeexManager"){
                notify('¡Se recibio un nuevo mensaje!', 'info', { autoClose: true });
                if(isOpenChatBeex){
                    obtenerChat(recarga.codPeticion)
                }else{
                    listarRecargas(startDate,endDate,50);
                }
            }else{
                listarRecargas(startDate,endDate,50);
                notify('¡Se Envio una Recarga!', 'info', { autoClose: true });
            }
        }
    }, [stateSocket.payload])
    // useEffect(() => {
    //     // console.log("OBJECT -> ", Object)
    //     if (Object.keys(stateSocket.payload).length > 0) {
    //         console.log("stateSocket -> ", stateSocket)
    //         audioRecarga.current.play(); 
    //         listarRecargas(startDate,endDate,50);
    //         // notify('¡Se Envio una Recarga!', 'info', { autoClose: true });
    //         notify(stateSocket.payload.bd, 'info', { autoClose: true });
    //     }
    // }, [stateSocket.payload])

    // useEffect(()=>{

    // },[])
    const handleFocus = (ref) => {
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
        }
      };

    const abrirChat=(chat)=>{
        obtenerChat(chat)
        closeModal()
        openModalChatBeex()
        editarValorChat('chatActivo', true)
    }

    const abrirModalRecargas =()=>{
        openModalRecarga()
    } 
    const enviarMensaje = (chat)=>{
        guardarEditarMensaje()
        // chat.mensaje = ""
        obtenerChat(chat)
    
    }


    return (
        <>
            <audio ref={audioRecarga} src={ sonidoRecarga} />
            <ContenedorParametros titulo='Solicitudes de clientes'>
                <div className="flex items-center">
                    <i className="mr-[10px] far fa-calendar-alt"></i>
                    <DatePickerABX date={startDate} setDate={setStartDate}/>
                </div>
                <div className="flex items-center">
                    <i className="mr-[10px] far fa-calendar-alt"></i>
                    <DatePickerABX date={endDate} setDate={setEndDate}/>
                </div>
                <SearchTable tablaId={idTablaRecargas}></SearchTable>
            </ContenedorParametros>

                <BotonesEstado listarRecargas={listarRecargas} estadoActual={estadoBotonPintar} fechaInicio={startDate} fechaFin={endDate} ></BotonesEstado>
                <div className=" containerScroll mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla" >
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="w-[30px]">ID</th>
                                <th>FECHA</th>
                                <th>USUARIO</th>
                                <th>CORREO</th>
                                {/* <th>BANCO</th> */}
                                <th>CELULAR</th>                    
                                <th>COMENTARIO</th>
                                <th className="text-right">IMPORTE</th>
                                {/* <th className="text-right"></th> */}
                                {
                                estadoBotonPintar === 0 &&
                                    <th>ESTADO</th>
                                }
                                <th className=""></th>
                                <th className=""></th>
                                {
                                // Number(status) === 3 &&
                                //     <th className="w-[30px]"></th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {   
                                recargas.length > 0 
                                ? recargas.map((r, i) => {
                                    const fechaRecarga = r.fechaHoraCreacion.split('T')[0] + ' ' + r.fechaHoraCreacion.split('T')[1].split('.')[0]
                                    return (
                                        <tr key={r.codPeticion}>
                                            <td>{r.codPeticion}</td>
                                            <td className="text-center">{fechaRecarga}</td>
                                            <td className="text-center">{(r.nomPersona + ' ' + r.apePersona)}</td>
                                            <td className="text-center">{r.correoPrincipal}</td>
                                            {/* <td className="text-center">{r.nomEntidadBancaria ? r.nomEntidadBancaria : ''}</td> */}
                                            <td className="text-center">{r.codUsuario? r.numCelularPrincipal : ''}</td>                    
                                            <td className="max-w-[140px]">
                                                {
                                                    r.comentario !== null &&
                                                    <>
                                                        <div data-tip data-for={'id-tooltip-' + r.codPeticion} className="w-full whitespace-nowrap overflow-hidden text-ellipsis">{r.comentario}</div>
                                                        <Tooltip id={'id-tooltip-' + r.codPeticion}>
                                                            {r.comentario}
                                                        </Tooltip>
                                                    </>
                                                }
                                            </td>
                                            {/* <td className="text-right">{Number(r.montoVoucher).toFixed(2)}</td> */}
                                            
                                            {
                                            estadoBotonPintar === 0 &&
                                                <td className="text-center"><span className={formatState(r.codEstado)}>{r.nomEstado}</span></td>
                                            }
                                            
                                            <td className="text-center">
                                                <button onClick={() => {obtenerRecarga(r.codPeticion);abrirModalRecargas()}} className="bg-blue-500 hover:bg-blue-600 text-[14px] px-[5px] py-1 rounded">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            
                                                <button onClick={() => {abrirChat(r.codPeticion);obtenerRecarga(r.codPeticion)}} className={` ${r.codEstado == 50?'hidden':''} ml-2 bg-green-500 hover:bg-green-600 text-[14px] px-[5px] py-1 rounded absolute`}>
                                                {/* <button onClick={() => {abrirChat(r.codPeticion)}} className={` ${r.codEstado == 50?'hidden':''} ml-2 bg-green-500 hover:bg-green-600 text-[14px] px-[5px] py-1 rounded`}> */}
                                                    <i className="fas fa-comments"></i>
                                                    { r.numMensajePendiente > 0 ?
                                                        <div className='absolute bottom-4 left-4'>
                                                            <div className='rounded-[50%] border-2 bg-blue-600 text-base  w-[17px] h-[17px]'>
                                                                <p className='text-[9px] font-bold left-1.5 bottom-[-3px]  absolute'>{r.numMensajePendiente}</p>
                                                                {/* <span className='text-[8px] absolute bottom-6'>1</span> */}
                                                            </div>
                                                        </div>
                                                        :''
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr><td colSpan="10" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

            <ModalRecarga 
            // obtenerUsuarioEstado(recarga.codUsuario,recarga.codPeticion)
                isOpen={isOpenModalRecarga} closeModal={closeModalRecarga} actionRecargar={aceptarRecarga} actionDenegar={openModalAmonestarBloquear}
                title="Gestión de Recargas"
                spinner={spinner}
                validButton = {{confirm: recarga.codEstado === 50 ? true : false , denied: recarga.codEstado === 50 ? true : false, cancel:true}}
                
            >
                <div className="w-[700px]  relative flex gap-1 items-center  justify-center">
                    <div className='w-[400px] '  >     
                        <label className='bg-[#2f3134] text-[#1da8db] absolute top-[18px]' style={{zIndex:'100000'}}>Datos Usuario</label>
                        <div className=" mb-[30px] relative justify-center  w-full form-content rounded" style={{border:'solid 1px gray'}}> 
                            <div className='ml-5 mt-3'>
                                <label className='mr-1  mt-2'> Usuario:</label>
                                <input onChange={(e)=> editarValorRecarga('nomPersona',e.target.value)} defaultValue={recarga.nomPersona} className={`${classNameInput}`}  disabled/>
                            </div>
                                
                            <div className='ml-5'>
                                <label className='mr-1  mt-2'> Celular:</label>
                                <input onChange={(e)=>editarValorRecarga('numCelularPrincipal',e.target.value)} defaultValue={recarga.numCelularPrincipal} className={`${classNameInput}`} disabled/>
                            </div>
                            <div className='ml-5'>
                                <label className='mr-1  mt-2'> Correo:</label>
                                <input onChange={(e)=>editarValorRecarga('correoPrincipal',e.target.value)} defaultValue={recarga.correoPrincipal} className={`${classNameInput}`} disabled/>
                            </div>
                            <div className='ml-5'>
                                <label className='mr-1  mt-2'> Otro:</label>
                                <input onChange={(e)=>editarValorRecarga('otro',e.target.value)} defaultValue={recarga.otro} className={`${classNameInput}`}/>
                            </div>
                            <center className='mb-3'>
                            </center>
                        </div>

                            <label className='bg-[#2f3134] text-[#1da8db]  absolute top-[262px]' style={{zIndex:'100000'}}>Detalle Recarga</label>
                        <div className="mt-3 w-full relative form-content rounded" style={{border:'solid 1px gray'}}>
                            <div className='ml-5 mt-3'>
                                <label className='mr-1  mt-2'> Fecha:</label>
                                <input onChange={(e)=>editarValorRecarga('fechaHoraCreacion',e.target.value)} defaultValue={recarga.fechaHoraCreacion && recarga.fechaHoraCreacion.split('T')[0] + ' ' + recarga.fechaHoraCreacion.split('T')[1].split('.')[0]} className={`${classNameInput}`} disabled/>
                            </div>
                            <div className='ml-5'>
                                <label className='mr-1  mt-2'> Banco:</label>

                                <select className={`${classNameInput}`} onChange={(e)=>editarValorRecarga('nomEntidadBancaria',e.target.value)} defaultValue={recarga.nomEntidadBancaria}>
                                    <option key={0} value={0}>-- Seleccione una opción --</option>
                                    {
                                        bancos?.map(banco => {
                                            return <option key={banco.codEntidadBancaria} value={banco.codEntidadBancaria}>{banco.abrevEntidadBancaria}</option>
                                        })
                                    }   
                                </select>

                                {/* <input onChange={(e)=>editarValorRecarga('nomEntidadBancaria',e.target.value)} defaultValue={recarga.nomEntidadBancaria} className={`${classNameInput} caret-input`} disabled={recarga.codEstado === 50 ? false : true} /> */}
                            </div>

                            <div className='ml-5'>
                                <label className='mr-1  mt-2'> N° Op.:</label>
                                <input onChange={(e)=>editarValorRecarga('numOperacion',e.target.value)} defaultValue={recarga.numOperacion} className={`${classNameInput} caret-input`} disabled={recarga.codEstado === 50 ? false : true} />
                            </div>
                        
                            <div className='ml-5'>
                                <span>Monto S/.
                                    <input
                                        onChange={(e) => editarValorRecarga('montoVoucher',e.target.value )} 
                                        value={recarga.montoVoucher} 
                                        // className={`ml-3 text-white h-[30px] rounded px-4 w-[120px] bg-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 h-[40px] text-center text-[20px] caret-input `}
                                        className={`ml-3 text-white h-[30px] rounded px-4 w-[120px] bg-zinc-900 text-[30px] focus:outline-none focus:ring-1 focus:ring-blue-500 h-[40px] text-center  caret-input `}
                                        onKeyPress={(e) => soloDecimal(e, e.target)}
                                        onFocus={(e) => e.target.select()}
                                        onBlur={(e) => editarValorRecarga('montoVoucher', e.target.value)}
                                        disabled={recarga.codEstado === 50 ? false : true}
                                        
                                        // onBlur={(e) => Number(e.target.value).toFixed(2)}
                                        />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded w-[320px] h-[535px] relative" style={{border: '1px solid gray'}}>
                            <div className= {` ${cargando? '  ': 'hidden'} mt-[70px] ml-[30px] absolute`}>
                                <div className="absolute z-113212110 loadingT text-[25px]">Extrayendo texto...
                                    <div className="spinner-sec spin-sec-oneT"></div>
                                    <div className="spinner-sec spin-sec-twoT"></div>
                                    <div className="spinner-sec spin-sec-threeT"></div>
                                </div>
                            </div>
                        <button  onClick={() => listarHistorialRecargas(recarga.codUsuario)} className='absolute right-0 bottom-[60px] bg-green-500 hover:bg-green-700 text-xl rounded' style={{zIndex:'100000'}}>
                            <i data-tip data-for='toolHistorial' className="m-1 fa fa-list" />
                            <Tooltip id='toolHistorial'>Mostrar Historial</Tooltip>
                        </button>
                        <button data-tip data-for='toolZoomFoto' className='absolute right-0 bottom-0 bg-blue-500 hover:bg-blue-700 text-xl rounded' style={{zIndex:'100000'}}>
                            <a  className="m-1 fa fa-search-plus" target="_blank" href={`${fotoUrl}`}></a>
                            <Tooltip id='toolZoomFoto' >Zoom</Tooltip>
                        </button>
                        <button onClick={()=>leerImagen(fotoUrl)} className='absolute right-0 bottom-[30px] bg-green-500 hover:bg-green-700 text-xl rounded' style={{zIndex:'100000'}}>
                            <i data-tip data-for='toolExtraerTexto' className="m-1 fa fa-eye" />
                            <Tooltip id='toolExtraerTexto'>Extraer Texto</Tooltip>
                        </button>
                        <img src={fotoUrl} className="flex rounded h-full w-full" alt="sin imagen" />
                    </div>
                </div>
            </ModalRecarga>

            <Modal 
                isOpen={isOpenAmonestarBloquear} closeModal={closeModalAmonestarBloquear} action={()=>{rechazarRecarga();guardarEditarMensaje()}}
                title= {"Denegar recarga"}
                spinner={spinner}
                textButtons={{ confirm: 'Denegar', denied:'Cancelar'}}
                validButton ={{confirm: true, denied: true}}
            >
                <>
                    <div className="flex gap-8 items-center flex-wrap justify-center">
                        <div className="w-[800px] px-4">
                        
                            <label className="text-center">Ingrese comentario para enviar al usuario:</label>
                            {/* <textarea autoFocus={true} onChange={(e) =>editarValorRecarga('comentario', e.target.value)} className={`${classNameInput2} caret-input `} >Estimado Cliente, su recarga fue Denegada, por favor podría' </textarea> */}
                            <textarea autoFocus={true} onChange={(e) =>{editarValorRecarga('comentario', e.target.value);editarValorChat('mensaje', e.target.value);editarValorChat("codPeticion",recarga.codPeticion);editarValorChat("codUsuarioDestino", recarga.codUsuario);editarValorChat("codUsuario", recarga.codUsuario);editarValorChat("nomUsuario", recarga)}} className={`${classNameInput2} caret-input `}> </textarea>
                            
                            <div className='relative mt-[8px] text-right max-w-full'> 
                                <label className='mr-[10px]'>Habilitar Conversación</label>
                                <label className="switch top-1">
                                    {/* <input className='' type="checkbox" onChange={(e)=> {setComentarioBloqueo(e.target.checked ? true : false ); editarValorRecarga('sugerirBloqueo',e.target.checked? 5 : 0)}}/> */}
                                    <input className='' type="checkbox" onChange={(e)=>editarValorChat('chatActivo', e.target.checked? true : false)}/>
                                    <div className="slider"></div>
                                </label>
                            </div>
                            
                            
                            <div className='relative mt-[8px] text-right max-w-full'> 
                                <label className='mr-[10px]'>Amonestar Usuario</label>  
                                <label className="switch top-1"> 
                                    <input className='' type="checkbox" onChange={(e)=> {setComentarioBloqueo(e.target.checked ? true : false ); editarValorRecarga('amonestarUsuario', e.target.checked? 1 : 0)}} />
                                    <div className="slider"></div>
                                </label>
                            </div>
                                
                            <div className='relative mt-[8px] text-right max-w-full'> 
                                <label className='mr-[10px]'>Sugerir Bloqueo</label>
                                <label className="switch top-1">
                                    <input className='' type="checkbox" onChange={(e)=> {setComentarioBloqueo(e.target.checked ? true : false ); editarValorRecarga('sugerirBloqueo',e.target.checked? 5 : 0)}}/>
                                    <div className="slider"></div>
                                </label>
                            </div>

                            <div className={`w-[600px] px-4 ${comentarioBloqueo? ' ' : ' hidden '} `}>
                                <label className="text-center">Ingrese el motivo para la Amonestación y/o Bloqueo:</label>
                                <textarea onChange={(e) =>{editarValorRecarga('motivoAmonestacionBloqueo', e.target.value)}} className={`${classNameInput2} caret-input `}> </textarea>
                            </div>

                        </div>

                    </div>
                </>                
            </Modal> 
        
            <Modal
                isOpen={isOpenHistorial} closeModal={closeModalHistorial} action={closeModalHistorial}
                title= {"Historial 10 Ultimas Recargas"}
                spinner={spinner}
                textButtons={{ confirm: 'Cerrar', denied:'Cancelar'}}
                validButton ={{confirm: true, denied: false}} 
            >
                <div className=" containerScroll mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla">
                    <table className="table">
                        <thead>
                            <tr>    
                                <th className="w-[30px]">N</th>
                                <th>COD</th>
                                <th>FECHA</th>
                                <th>COMENTARIO</th>
                                <th>MONTO</th>
                                <th>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   
                                recargaHistorial.length > 0 
                                ? recargaHistorial.map((h, i) => {
                                    const fechaRecarga = h.fechaHoraCreacion.split('T')[0] + ' ' + h.fechaHoraCreacion.split('T')[1].split('.')[0]
                                    return (
                                        <tr key={h.codPeticion}>
                                            <td>{++i}</td>
                                            <td>{h.codPeticion}</td>
                                            <td className="text-center">{fechaRecarga}</td>
                                            <td className="text-center">{h.comentario}</td>
                                            <td className="text-center">{h.montoVoucher}</td>
                                            <td className="text-center"><span className={formatState(h.codEstado)}>{h.nomEstado}</span></td>
                                        </tr>
                                    )
                                })
                                : <tr><td colSpan="10" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>

            </Modal>



            <Modal 
                isOpen={isOpenChatBeex} closeModal={closeModalChatBeex} action={{}}
                title= {`CHAT ONLINE [${recarga.codPeticion}] - ${recarga.nomUsuario}`} 
                spinner={spinner}
                // textButtons={{ confirm: 'Aceptar', denied:'cerrar'}}
                textButtons={{  denied:'cerrar'}}
                // validButton ={{confirm: true, denied: true}}
                validButton ={{ denied: true}}
            >
                <>
                    <div className='h-[450px] '>
                        <ol  className="chat  containerScroll rounded h-[400px] w-[420px]">
                                {   
                                    chat.length > 0 
                                    ? chat.map((c, i) => {
                                        return (
                                            // <li className="other">
                                            <li ref={i === chat.length - 1 ? ultimoElementoRef : null} {... i == chat.length-1 ? handleFocus(ultimoElementoRef):''} key={i} className={`${c.codAccesoTipo == 1? 'other' : 'self'}`} >
                                                {/* <div className='border '> {c.codAccesoTipo} - {c.mensaje} - {c.fechaHoraCreacion} - {c.chatActivo}</div> */}
                                                <div className="avatar">
                                                    <img  src={c.codAccesoTipo == 1? fotoChat : fotobeexserver} className='w-[50px]' alt=""/> 
                                                </div>
                                                <div className="msg">
                                                    <p>{c.mensaje}</p>
                                                    <time>{c.fechaHoraCreacion}</time>
                                                </div>
                                            </li>
                                        )
                                    })
                                    : <div colSpan="10" className="text-center w-[100px]">No hay Chat.</div>
                                }
                        </ol>


                        <div className='mt-5 border-t  flex items-center'>
                            <textarea id='txtComentario' autoFocus={true} value={chat.mensaje} placeHolder="escriba aqui..." className={`text-white h-[50px] rounded mt-[10px] px-4 w-[350px] bg-zinc-900 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 caret-input  `} 
                                onChange={(e) =>{editarValorRecarga('comentario', e.target.value);editarValorChat('mensaje', e.target.value);editarValorChat("codPeticion",recarga.codPeticion);editarValorChat("codUsuarioDestino", recarga.codUsuario);editarValorChat("codUsuario", recarga.codUsuario);editarValorChat("nomUsuario", recarga.nomUsuario)}}> 
                            </textarea>
                            <button className='bg-green-500 p-3 h-12 mt-2 rounded  ml-2' onClick={()=>enviarMensaje(recarga.codPeticion)}>  Enviar </button>
                        </div>

                        <div className='relative p-5 text-left w-[70%]'> 
                            <label className='mr-[10px]'>Habilitar Conversación</label>
                            <label className="switch top-1">
                                {/* <input className='' type="checkbox" onChange={(e)=> {setComentarioBloqueo(e.target.checked ? true : false ); editarValorRecarga('sugerirBloqueo',e.target.checked? 5 : 0)}}/> */}
                                <input defaultChecked className='' type="checkbox" defaultValue={chat.chatActivo} onChange={(e)=>{editarValorChat('chatActivo', e.target.checked? true : false);obtenerChat(recarga.codPeticion)}}/>
                                <div className="slider"></div>
                            </label>
                        </div>
                    </div>
                </>                
            </Modal> 

        </>
    )
}
