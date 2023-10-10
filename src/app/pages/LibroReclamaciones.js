import React, { useEffect, useState, useRef,useContext } from 'react';
// import { BotonNuevo } from "../components/buttons/BotonNuevo";
// import { BotonProcesar } from "../components/buttons/BotonProcesar";
import { ContenedorParametros } from "../components/utils/ContenedorParametros";
import { ContenedorTabla } from '../components/utils/ContenedorTabla';
import { useLibroReclamaciones } from '../../hooks/useLibroReclamaciones';
import { Tooltip } from '../components/utils/Tooltip';
import { Modal } from '../components/modal/Modal';
import { useSpinner } from '../../hooks/useSpinner';
import { DatePickerABX } from '../components/pickers/DatePicker'
import { UserContext } from '../../../src/context/provider/UserProvider';
export const LibroReclamaciones =()=>{
const {reclamos, listarReclamos,isOpenModal,closeModal,spinner,editarReclamo,guardarEditarReclamo,editarValorReclamo} = useLibroReclamaciones();
const [ startDate, setStartDate ] = useState(new Date())
const [ endDate, setEndDate ] = useState(new Date())
const { stateUser, signOut } = useContext(UserContext)
const classNameInput = "text-white h-[30px] rounded px-4 w-full bg-zinc-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
useEffect(() => {
    listarReclamos();
    // cargarDatosPersona()
}, []);

return(
    <>
        <ContenedorParametros titulo="Libro de reclamaciones">
            <div className="flex items-center">
                <i className="mr-[10px] far fa-calendar-alt"></i>
                <DatePickerABX date={startDate} setDate={setStartDate}/>
            </div>
            <div className="flex items-center">
                <i className="mr-[10px] far fa-calendar-alt"></i>
                <DatePickerABX date={endDate} setDate={setEndDate}/>
            </div>
        </ContenedorParametros>
        <ContenedorTabla>
                <div className='containerScroll  mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla'>
                    <table className="table ">
                        <thead>
                            <tr>
                                <th className="w-[30px]">N</th>
                                <th className="w-[30px]">CÓDIGO</th>
                                <th className="text-left">NOMBRE</th>
                                <th>TIPO DOC</th>
                                <th>NRO. DOC</th>
                                <th>DIRECCION</th>
                                <th>TELEFONO</th>
                                <th>E-MAIL</th>
                                <th>DETALLE RECLAMO</th>
                                <th>DETALLE ATENCIPON</th>
                                <th className="w-[10px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {   
                                reclamos.length > 0 
                                ? reclamos.map((reclamo, i) => {
                                    return (
                                        <tr key={reclamo.codReclamo}>
                                            <td>{ i + 1}</td>
                                            <td>{ reclamo.codReclamo}</td>
                                            <td className="text-left">{reclamo.nombrePersona}</td>
                                            <td className="text-center">{reclamo.nomDocumentoTipo.toUpperCase()}</td>
                                            <td className="text-center">{reclamo.nroDocumento}</td>
                                            <td className="text-center">{reclamo.direccion}</td>
                                            <td className="text-center">{reclamo.telefono}</td>
                                            <td className="text-center">{reclamo.email}</td>
                                            <td className="text-center">{reclamo.detalleReclamo}</td>
                                            <td className="text-center">{reclamo.detalleAtencion}</td>
                                            {/* <td className='text-center'><span className={`${formatState(reclamo.codEstado === 1? 4 : 7 )}`}>{reclamo.nomEstado}</span></td> */}
                                            <td className="text-center w-[10px]" >
                                                {
                                                    reclamo.detalleAtencion != ''?
                                                    <button onClick={()=>editarReclamo('codReclamo',reclamo.codReclamo,'codUsuarioAtencion',stateUser.codUsuario)} className="bg-blue-500 hover:bg-blue-600 text-[14px] px-[5px] py-1 rounded">
                                                        <i className="fas fa-edit"></i>
                                                    </button>:''
                                                }
                                            </td>    
                                            

                                            
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
            isOpen={isOpenModal} closeModal={closeModal} action={() => guardarEditarReclamo()}
            title="Atender reclamo"
            spinner={spinner}
            //textButtons={{ confirm: '', denied: 'Cerrar' }}
            //validButton={{confirm: true, denied: true}}
        >
            <div className="flex gap-8 items-center flex-wrap justify-center">
                <div className="w-[400px] flex flex-col px-4">
                    <label className='mb-[10px] w-full'>Ingrese su comentario: </label>
                    <textarea onChange={(e)=>editarValorReclamo('detalleAtencion',e.target.value)} autoFocus={true} className={`${classNameInput} caret-input h-[70px] w-full text-[15px] py-3`}></textarea> 
                </div>
            </div>
        </Modal>

    </>


)


}