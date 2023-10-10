import React, { useEffect, useState, useRef } from 'react';
import { BotonNuevo } from "../components/buttons/BotonNuevo";
import { BotonProcesar } from "../components/buttons/BotonProcesar";
import { ContenedorParametros } from "../components/utils/ContenedorParametros";
import { Modal } from '../components/modal/Modal'; 
import { useDocumentos } from '../../hooks/useDocumentos';
import { usePersonas } from '../../hooks/usePersonas';
import { ContenedorTabla } from '../components/utils/ContenedorTabla';
import { soloCelular, soloDNI, formatState } from '../../utils/utils';
import { useSpinner } from '../../hooks/useSpinner';
export const PersonasPlataforma = () => {
    const { personas, listarPersonas, guardarEditarPersona, persona, editarValorPersona, obtenerPersona, isOpenModal, closeModal , cargarDatosPersona, eliminarPersona,isOpenModalEliminar,closeModalEliminar,personaEliminar,listarPersonasCombo,personasCombo} = usePersonas();
    const { documentos } = useDocumentos();
    const [spinner, mostrarSpinner, ocultarSpinner] = useSpinner();
    const classNameInput = "text-white h-[30px] rounded px-4 w-full bg-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"   

    return (
        <>
            <ContenedorParametros
                titulo="Personas"
            >
                <div>
                    <BotonProcesar onClick={() => listarPersonas()} ></BotonProcesar>
                </div>
                <div>
                    <BotonNuevo onClick={() => obtenerPersona()}></BotonNuevo>
                </div>
            </ContenedorParametros>
                
            <ContenedorTabla>
                <div className='containerScroll  mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla'>
                    <table className="table ">
                        <thead>
                            <tr>
                                <th className="w-[30px]">N</th>
                                <th className="text-left">NOMBRE</th>
                                <th>NRO.DOCUMENTO</th>
                                <th>TELEFONO</th>
                                <th>F.CREACION</th>
                                <th>ESTADO</th>
                                <th className="w-[10px]"></th>
                                <th className="w-[10px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {   
                                personas.length > 0 
                                ? personas.map((persona, i) => {
                                    return (
                                        <tr key={persona.codPersona}>
                                            <td>{ i + 1}</td>
                                            <td className="text-left">{persona.nomPersona} {persona.apellidoPat} {persona.apellidoMat}</td>
                                            <td className="text-center">{persona.numDocumento}</td>
                                            <td className="text-center">{persona.telefonoActual}</td>
                                            <td className="text-center">{persona.fechaHoraCreacion}</td>
                                            <td className='text-center'><span className={`${formatState(persona.codEstado === 1? 4 : 7 )}`}>{persona.nomEstado}</span></td>
                                            <td className="text-center w-[10px]" >
                                                <button onClick={() => obtenerPersona(persona.codPersona)} className="bg-blue-500 hover:bg-blue-600 text-[14px] px-[5px] py-1 rounded">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </td>    
                                            {
                                                persona.codEstado===1 && <td className="text-center w-[10px]" >
                                                <button  onClick={()=> personaEliminar(persona.codPersona)} className="bg-red-500 hover:bg-red-800 text-[14px] px-[5px] py-1 rounded ml-3">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                            }
                                            
                                        </tr>
                                    )
                                })
                                : <tr><td colSpan="9" className="text-center">No hay información que mostrar con los parámetros seleccionados.</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </ContenedorTabla>

            <Modal 
                isOpen={isOpenModal} closeModal={closeModal} 
                action={() => guardarEditarPersona()}
                title="Registrar nueva persona"
            >
                    <div className="flex  items-center flex-wrap justify-center">
                        <div className="w-[500px] px-4">
                            <div className="flex flex-col justify-between w-full form-content">                        
                                <div className='lg:flex-col lg:w-full'>
                                    <label>Tipo Documento: </label>
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <select className={`${classNameInput} `} defaultValue={persona.codDocumentoTipo} onChange={(e) => {editarValorPersona("codDocumentoTipo", e.target.value)}} >
                                            <option value={0}>--Selecciona--</option>
                                            {
                                                documentos.map(d => {
                                                    return <option key={d.codDocumentoTipo} value={d.codDocumentoTipo}>{d.abrevDocumentoTipo}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                
                                <div className='lg:flex-col lg:w-full'>
                                    <label>Numero de Documento: </label>
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <input autoFocus={true} className={`${classNameInput} caret-input`} defaultValue={persona.numDocumento} onChange={(e) => {editarValorPersona("numDocumento", e.target.value)}} onKeyPress={(e) => soloDNI(e, e.target)} />
                                        <button onClick={()=>cargarDatosPersona()} className='fa fa-eye'></button>
                                    </div>
                                </div>
                                
                                <div className='lg:flex-col lg:w-full'>
                                    <label>Nombre: </label>
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <input  className={`${classNameInput} caret-input`} defaultValue={persona.nomPersona} onChange={(e) => editarValorPersona("nomPersona", e.target.value)} />
                                    </div>
                                </div>
                                
                                <div className='lg:flex-col lg:w-full'>
                                    <label>Apellido Paterno: </label>
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <input className={`${classNameInput} caret-input`} defaultValue={persona.apellidoPat} onChange={(e) => editarValorPersona("apellidoPat", e.target.value)} />
                                    </div>
                                </div>
                                
                                <div className='lg:flex-col lg:w-full'>
                                    <label>Apellido Materno: </label>
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <input className={`${classNameInput} caret-input`} defaultValue={persona.apellidoMat} onChange={(e) => editarValorPersona("apellidoMat", e.target.value)} />
                                    </div>
                                </div>
                                <div className='lg:flex-col lg:w-full'>
                                    <label>Telefono: </label>
                                    <div className="flex items-center gap-4 w-[250px]">
                                        <input className={`${classNameInput} caret-input`} defaultValue={persona.telefonoActual} onChange={(e) => editarValorPersona("telefonoActual", e.target.value)} onKeyPress={(e) => soloCelular(e,e.target)}/>
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                    
                </div>
            </Modal>

            <Modal 
                isOpen={isOpenModalEliminar} closeModal={closeModalEliminar} action={() => eliminarPersona()}
                title= "¿Seguro que desea eliminar a la persona?"
                spinner={spinner}
                textButtons={{ confirm: 'Si', denied: 'No' }}
            >
                    <div className="flex gap-8 items-center flex-wrap justify-center">
                        <div className="w-[400px] px-4">
                            {/* <label className="text-center gap-8">¿Está seguro de eliminar la Persona? </label> */}
                            <label className="text-center gap-8">Ingrese Comentario de Eliminación </label>
                            <div className="flex items-center gap-4 w-[280px]">
                                <input autoFocus={true} className={`${classNameInput} caret-input`} defaultValue={persona.motivoEliminacion} onChange={(e) => editarValorPersona("motivoEliminacion", e.target.value)}/>
                            </div>
                        </div>
                    </div>
            </Modal>   

        </>
    )


}












