import React, { useState, useRef, useContext, useEffect } from 'react';
import '../../assets/css/views/recargas.css'
import { Modal } from '../components/modal/Modal'
import { BotonProcesar } from '../components/buttons/BotonProcesar';
import { useSpinner } from '../../hooks/useSpinner'
import { useUsuariosAplicativo } from '../../hooks/useUsuariosAplicativo';
import { formatDate, notify, soloDecimal, formatState, formatoNombre,soloCelular,soloNumero } from '../../utils/utils'
import { ContenedorParametros } from '../components/utils/ContenedorParametros';
import { SelectFiltro } from '../components/forms/SelectFiltro';
// import { useEstadosUsuarios } from '../../hooks/useEstadosUsuarios';
import { Tooltip } from '../components/utils/Tooltip';
import { useAmonestaciones } from '../../hooks/useAmonestaciones';
import { BotonNuevo } from '../components/buttons/BotonNuevo';
import { ModalRecarga } from '../components/modal/ModalRecarga';
import { useUsuarioEstado } from '../../hooks/useUsuarioEstado';
import { SearchTable } from '../components/utils/SearchTable';
import { isNamedTupleMember } from 'typescript';

export const UsuariosAplicativo = () => {
    const {usuarios, listarUsuarios,usuario,editarValorUsuario,obtenerUsuario, spinner,isOpen, closeModal, cambiarEstadoUsuario,isOpenCambiarEstado,closeModalCambiarEstado,obtenerUsuarioCambiarEstado} =  useUsuariosAplicativo();
    // const { estadosUsuarios } = useEstadosUsuarios();
    const tablaPersonaRef = useRef()
    const classNameSelect = "text-white h-[30px] rounded px-4 w-[250px] bg-zinc-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
    const classNameInput = "text-white h-[30px] rounded px-4 w-full bg-zinc-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
    const classNameInputarea = "text-white h-[80px] rounded w-full bg-zinc-900 text-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
    const {listarAmonestaciones, amonestaciones,RegistrarAmonestacion,editarValorAmonestacion, isOpenModalAmonestaciones, openModalAmonestaciones, closeModalAmonestaciones, bloqueos, listarBloqueos, isOpenModalBloqueos, closeModalBloqueos,registrarUsuarioEstado,amonestacion} = useAmonestaciones()
    const [status, setStatus] = useState(1)
    const idTablaUsuarios = "tablaUsuarioAplicativo";

    
    useEffect(()=>{
        listarUsuarios(status)
    },[status])

    const cargarDetalleBloqueo = (u) => {
        // console.log(u)
        editarValorAmonestacion('codUsuario',u.codUsuarioOAuth)

        listarBloqueos(u.codUsuarioOAuth)
    }
        
    return (
        <>
            <ContenedorParametros titulo='Usuarios Beex'>
                <i className="mr-[10px] fa fa-filter"/>
                <select className={`${classNameSelect}`} value={status} onChange={e => setStatus(e.target.value)}>
                    <option value = "0">Todos</option>
                    <option value = "1">Activo</option>
                    <option value = "2">Bloqueado</option>
                </select>
                <SearchTable tablaId={idTablaUsuarios}></SearchTable>
                <BotonProcesar onClick={() => listarUsuarios(status)} spinner={spinner.toString()}></BotonProcesar>{/* primer1 (estado)| segundo1 (CodTipoPersona))*/}

            </ContenedorParametros>

             {/* CABECERA Y CUERPO */}
            <div className="containerScroll mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla">
                <table id={idTablaUsuarios} ref={tablaPersonaRef} className="table">
                    <thead> 
                        <tr>
                            <th className="w-[40px]">N</th>
                            <th className="w-[50px]">CODUSUARIO</th>
                            <th>NOMBRE</th>
                            <th>USUARIO</th>
                            <th>DNI</th>
                            <th>CELULAR</th>                    
                            <th>FECHA CREACIÓN</th>
                            <th className="text-center w-[80px]">ESTADO</th>
                            <th className='w-[50px]'></th>
                            <th className='w-[50px]'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            usuarios.length > 0 
                            ? usuarios.map((u, i) => {
                                let classNameBateria = ''
                                if (u.numAmonestacionTotal === 0 ) {
                                    classNameBateria = 'fa fa-battery-full text-[20px] text-green-500' //verde
                                }else if (u.numAmonestacionTotal === 1){
                                    classNameBateria = 'fa fa-battery-half text-[20px] text-yellow-500' //amarillo
                                }else if (u.numAmonestacionTotal === 2){
                                    classNameBateria = 'fa fa-battery-quarter text-[20px] text-red-500' //rojo
                                }else if (u.numAmonestacionTotal === 3){
                                    classNameBateria = 'fa fa-battery-empty text-[20px] text-white-500' //blanco
                                } else {
                                    classNameBateria = 'fa fa-battery-empty text-[20px] text-green-500' //verde
                                }
                                const fechaRegistro = u.fechaRegistro.split('T')[0] + ' ' + u.fechaRegistro.split('T')[1].split('.')[0]
                                return (
                                    <tr key={u.codUsuarioOAuth}>
                                        <td>{++i}</td>
                                        <td>{u.codUsuarioOAuth}</td>
                                        <td className="text-center">{(u.nomPersona)}</td>
                                        <td className="text-center">{u.nomUsuario}</td>
                                        <td className="text-center">{u.numeroDocumento ? u.numeroDocumento : ''}</td>
                                        <td className="text-center">{u.numCelularPrincipal ? u.numCelularPrincipal : ''}</td>
                                        <td className="text-center">{fechaRegistro}</td>
                                        <td className="text-center">
                                            <span data-tip data-for={'pendiente-'+ u.codUsuarioOAuth} onClick={()=>{u.pendienteBloqueo? cargarDetalleBloqueo(u):notify('Este usuario no tiene Solicitud de Bloqueo','error')}} className={formatState(u.codEstado)}>{u.codEstado === 1 ? 'ACTIVO' : 'BLOQUEADO'}{u.pendienteBloqueo && <i className='fa fa-exclamation text-red-500'/>}</span>
                                            {u.pendienteBloqueo && <Tooltip id={'pendiente-'+ u.codUsuarioOAuth}> Se sugiere su Bloqueo </Tooltip>}
                                        </td> 
                                        <td>
                                            <i data-tip data-for={'codUsuario-'+ u.codUsuarioOAuth } className={`${classNameBateria}`} onClick={() => listarAmonestaciones(u.codUsuarioOAuth)}></i>
                                            <Tooltip id={'codUsuario-'+ u.codUsuarioOAuth}>{`Cantidad Amonestaciones ${u.numAmonestacionTotal}`}</Tooltip>
                                            {/* {u.numAmonestacionTotal} */}
                                        </td>

                                        <td className="text-center">
                                            <button  className="bg-black-500 hover:bg-blue-600 text-[14px] px-[5px] py-1 rounded">
                                                <i  data-tip data-for='VerDatos' onClick={() => obtenerUsuario(u.codUsuarioOAuth)} className="fa fa-address-card-o text-[14px]"></i>
                                            </button>
                                            <Tooltip id='VerDatos'>{`Ver Datos`}</Tooltip>
                                        </td>
                                    </tr>
                                )
                            })
                            : <tr><td colSpan="9" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            
            <Modal 
                isOpen={isOpen} closeModal={closeModal} action={{}}
                title="Detalles Usuario"
                spinner={spinner}
                textButtons={{ confirm: '', denied: 'Cerrar' }}
                validButton={{confirm: false, denied: true}}

            >
                <div className="flex gap-8 items-center flex-wrap justify-center">
                    <div className="w-[400px] px-4">
                        <div className="flex flex-col justify-between w-full form-content">
                            <div>
                                <label>Nombre</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                <input  className={`${classNameInput} caret-input`} defaultValue={usuario.nomPersona} onChange={(e) => editarValorUsuario("nomPersona", e.target.value)} disabled/>
                                    {/* <i className="fas fa-user"></i> */}
                                </div>
                            </div>

                            <div>
                                <label>Usuario</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                <input  className={`${classNameInput} caret-input`} defaultValue={usuario.nomUsuario} onChange={(e) => editarValorUsuario("nomUsuario", e.target.value)} disabled/>
                                    {/* <i className="fas fa-user"></i> */}
                                </div>
                            </div>

                            <div>
                                <label>Correo</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                    <input  className={`${classNameInput} caret-input`} defaultValue={usuario.correoPrincipal} onChange={(e) => editarValorUsuario("correoPrincipal", e.target.value)} disabled />
                                </div>
                            </div>
                            
                            <div>
                                <label>DNI</label>
                                <div className="flex items-center gap-4 w-[100px]">
                                <input  className={`${classNameInput} caret-input`} defaultValue={usuario.numeroDocumento} onChange={(e) => editarValorUsuario("numeroDocumento", e.target.value)} disabled/>
                                </div>
                                <label>Telefono</label>
                                <div className="flex items-center gap4 w-[100px]">
                                <input  className={`${classNameInput} caret-input`} onKeyPress={(e) => soloCelular(e,e.target)} defaultValue={usuario.numCelularPrincipal} onChange={(e) => editarValorAmonestacion("numCelularPrincipal", e.target.value)} disabled/>
                                    {/* <i className="fas fa-phone"></i> */}
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </div>
            </Modal>
            
            <ModalRecarga 
                isOpen={isOpenModalBloqueos} closeModal={closeModalBloqueos} actionRecargar={registrarUsuarioEstado} actionDenegar={{}}
                title= 'Verificar Bloqueo'
                spinner={spinner}
                textButtons = { {confirm: 'SI', denied: 'NO',cancel:'Cancelar'}}

                >
                <div className="flex gap-8 items-center flex-wrap justify-center">
                    <div className="w-[550px] px-4">
                        <div className="flex flex-col justify-between w-full form-content">
                            <div className='lg:flex-col flex-col lg:w-full' >
                                <label className='mb-[10px] w-full'>Solicitudes de Bloqueos:</label>
                                {/* <input  autoFocus={true} className={`${classNameInput} caret-input h-[80px] w-[500px] text-[15px]`} defaultValue={usuario.motivoCambioEstado} onChange={(e) => {editarValorUsuario("motivoCambioEstado", e.target.value)}} > */}
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-[40px]">N</th>
                                            <th className="">COMENTARIO</th>
                                            <th className="">USUARIO</th>
                                            <th className="">FECHA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {   
                                            bloqueos.length > 0 
                                            ? bloqueos.map((b, i) => {
                                                const FechaHoraInicio = b.fechaHoraInicio.split('T')[0] + ' ' + b.fechaHoraInicio.split('T')[1].split('.')[0]
                                                return (
                                                    <tr key={b.codUsuarioOAuth}>
                                                        <td>{++i}</td>
                                                        <td className="text-center">{b.motivoCreacion}</td>
                                                        <td className="text-center">{b.nomUsuario}</td>
                                                        <td className="text-center">{FechaHoraInicio}</td>
                                                    </tr>
                                                )
                                            })
                                            : <tr><td colSpan="9" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className='lg:flex-col flex-col lg:w-full mt-5'>
                                    <label className='mb-[10px] w-full'>Ingrese un comentario para el cambio de estado:  </label>
                                    <div className="flex items-center gap-4 w-full">
                                        <textarea autoFocus={true} className={`${classNameInput} caret-input h-[70px] w-full text-[15px] py-3`} defaultValue={amonestacion.motivoCreacion} onChange={(e) => editarValorAmonestacion("motivoCreacion", e.target.value)} />
                                    </div>
                                </div>

                            </div>
                    </div>
                </div>
            </ModalRecarga>   
                


            {/* <Modal 
                isOpen={isOpenCambiarEstado} closeModal={closeModalCambiarEstado} action={cambiarEstadoUsuario}
                title= 'Verificar Bloqueo'
                spinner={spinner}
                textButtons={{ confirm: 'Si', denied: 'No' }}
            >
                <div className="flex gap-8 items-center flex-wrap justify-center">
                    <div className="w-[400px] px-4">
                        <div className="flex flex-col justify-between w-full form-content">
                            <div className='lg:flex-col lg:w-full' >
                                <label className='mb-[10px]'>Mensaje de solicitud de Bloqueo</label>
                                <input autoFocus={true} className={`${classNameInput} caret-input`} defaultValue={usuario.motivoCambioEstado} onChange={(e) => {editarValorUsuario("motivoCambioEstado", e.target.value)}} />
                            </div>

                            <div className='lg:flex-col lg:w-full'>
                                    <label className='mb-[10px]'>Ingrese un comentario sobre el cambio del estado </label>
                                    <div className="flex items-center gap-4 w-[380px]">
                                        <input autoFocus={true} className={`${classNameInput} caret-input`} defaultValue={``} onChange={(e) => {editarValorUsuario("motivoCambioEstado", e.target.value)}} />
                                    </div>
                                </div>

                            </div>
                    </div>
                </div>
            </Modal>    */}
                

            <Modal 
                isOpen={isOpenModalAmonestaciones} closeModal={closeModalAmonestaciones} action={{}}
                title= {"Historial de Amonestaciones"}
                spinner={spinner}
                textButtons={{ confirm: '', denied:'Cerrar'}}
                validButton ={{confirm: false, denied: true}}
                >
                <>
                <div className="containerScroll mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla">
                <table className="table">
                        <thead>
                            <tr>
                                <th>N</th>
                                <th>DESCRIPCION</th>
                                <th>TIPO</th>
                                <th>USUARIO</th>
                                <th>FECHA CREACION</th>
                                <th>FECHA VENCIMIENTO</th>
                                {/* <th>VAUCHER</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {   
                                amonestaciones.length > 0 
                                ?
                                amonestaciones.map((a, i) => {
                                    const fechaInicio = a.fechaHoraInicio.split('T')[0] + ' ' + a.fechaHoraInicio.split('T')[1].split('.')[0]
                                    const fechaFin = a.fechaHoraFin.split('T')[0] + ' ' + a.fechaHoraFin.split('T')[1].split('.')[0]
                                    return (
                                        <tr key={a.codUsuarioEstado}>
                                            <td>{++i}</td>
                                            <td>{a.motivoCreacion}</td>
                                            <td className="text-center">{a.nomUsuarioEstadoTipo}</td>
                                            <td className="text-center">{a.nomPersonaCreacion}</td>
                                            <td className="text-center">{fechaInicio}</td>
                                            <td className="text-center">{fechaFin}</td>      
                                            {/* <td className="text-center">{a.codPeticion}</td>       */}
                                        </tr>
                                    )
                                })
                                : <tr><td colSpan="10" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                            }
                        </tbody>
                </table>
                </div>
                </>                
            </Modal> 
        </>
    )
}