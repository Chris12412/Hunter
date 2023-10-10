import React, {useEffect,useState, useContext} from 'react';
import '../../assets/css/views/recargas.css'
import { BotonProcesar } from '../components/buttons/BotonProcesar';
import { ContenedorParametros } from '../components/utils/ContenedorParametros';
import { formatState } from '../../utils/utils';
// import { useTipoUsuario } from '../../../src/hooks/useTipoUsuario';
import { useUsuariosPlataforma } from '../../../src/hooks/useUsuariosPlataforma';
import { usePersonas } from '../../../src/hooks/usePersonas';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../components/modal/Modal'; 
import { useTipoUsuario } from '../../hooks/useTipoUsuario';
import { BotonNuevo } from "../components/buttons/BotonNuevo";


export const UsuariosPlataforma = () => {
    const {usuarios, listarUsuarios,usuario,editarValorUsuario,obtenerUsuario, spinner,isOpen, closeModal, isOpenModalEliminar,closeModalEliminar ,guardarEditarUsuario,eliminarUsuario,usuarioEliminar} = useUsuariosPlataforma();
    const { personas, listarPersonas,listarPersonasCombo,personasCombo}= usePersonas()
    const [ verCombo, setVerCombo] = useState(true)
    const { listarTipoUsuarios, tipoUsuarios } = useTipoUsuario()
    useEffect (()=>{
        listarPersonas()
        listarTipoUsuarios()
    },[]) 

    const classNameInput = "text-white h-[30px] rounded px-4 w-full bg-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
    return (
        <>
            <ContenedorParametros
                titulo="Usuarios Web"
            >
                <div>
                    <BotonProcesar onClick={() => listarUsuarios()}></BotonProcesar>
                </div>
                <div>
                    <BotonNuevo onClick={() => {obtenerUsuario();setVerCombo(true)}}></BotonNuevo>
                </div>
            </ContenedorParametros>
                
            <div className="containerScroll ">
                <table className="table">
                    <thead>
                        <tr>
                        <th className='w-[30px]'>N</th>
                        <th className="w-[50px]">ID</th>
                            <th>NOMBRE</th>
                            <th>USUARIO</th>
                            <th>CORREO</th>        
                            <th>TIPO</th>
                            <th>ESTADO</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {   
                            usuarios.length > 0 
                            ? usuarios.map((u, i) => {
                                
                                return (
                                    <tr key={u.codUsuario}>
                                        <td>{++i}</td>
                                        <td>{u.codUsuario}</td>
                                        <td className="text-center">{u.nomPersona}</td>
                                        <td className="text-center">{u.nomUsuario}</td>
                                        {/* <td className="text-center">{u.telefonoActual}</td> */}
                                        <td className="text-center">{u.correoActual}</td>
                                        <td className="text-center"><span className={`${formatState(1)}}`}>{u.nomUsuarioTipo}</span></td>
                                        <td className='text-center'><span className={`${formatState(u.codEstado===1? 4 : 7) }`} > {u.nomEstado}</span></td>
                                        <td className="text-center">
                                            <button onClick={() =>{ obtenerUsuario(u.codUsuario); setVerCombo(false) }} className="bg-blue-500 hover:bg-blue-600 text-[14px] px-[5px] py-1 rounded">
                                                <i className='fas fa-edit'></i>
                                            </button>
                                        </td>
                                        <td>
                                        { u.codEstado!==5 &&
                                            <button className="bg-red-500 hover:bg-red-600 text-[14px] px-[5px] py-1 rounded">
                                                <i onClick={()=> usuarioEliminar(u.codUsuario)} className='fas fa-trash'></i>
                                            </button>
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

            <Modal 
                isOpen={isOpen} closeModal={closeModal} action={guardarEditarUsuario}
                title="Registrar nuevo usuario"
                spinner={spinner}
            >
                <div className=" flex gap-8 items-center flex-wrap justify-center">
                    <div className="w-[450px] px-4">
                        <div className="flex flex-col justify-between w-full form-content">
                            <div>
                                <label>Nombre: </label>
                                <div className={`flex items-center gap-4 w-[250px] `}>
                                    <input className={`${classNameInput}  ${verCombo? '  hidden   ' : ' '}   caret-input`} autoComplete='false' defaultValue={usuario.nomPersona} onChange={(e) => editarValorUsuario("nomPersona", e.target.value)} disabled/>
                                    <select className={`${classNameInput}  ${!verCombo? '  hidden ' : ' '} `}   autoFocus={true} onChange={(e) => editarValorUsuario("codPersona", e.target.value)} >
                                        <option value={0}>--Seleccione--</option>
                                        {
                                            personasCombo?.length > 0?
                                            personasCombo.map(p => {
                                                return <option key={p.codPersona} value={p.codPersona}>{p.nomPersona}</option>
                                            })  
                                            : <option>--Seleccion--</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>Tipo:</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                    <select className={classNameInput}>
                                        <option value={0} onChange={(e) => editarValorUsuario("codUsuarioTipo", e.target.value)}>--Selecccione--</option>
                                        {
                                            tipoUsuarios?.length > 0 ?
                                            tipoUsuarios.map(tu =>{
                                                return <option key={tu.codUsuarioTipo} value={tu.codUsuarioTipo}>{tu.nomUsuarioTipo}</option>
                                            })
                                            : <option>-- Seleccion --</option>
                                        }
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label>Nombre Usuario:</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                    <input className={`${classNameInput} caret-input`} autoComplete='false' defaultValue={usuario.nomUsuario} onChange={(e) => editarValorUsuario("nomUsuario", e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label>Clave</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                    <input type={'password'} className={`${classNameInput} caret-input`} autoComplete='false' defaultValue={usuario.clave} onChange={(e) => editarValorUsuario("clave", e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label>Correo:</label>
                                <div className="flex items-center gap-4 w-[250px]">
                                    <input className={`${classNameInput} caret-input`} autoComplete='false' defaultValue={usuario.correoActual} onChange={(e) => editarValorUsuario("correoPrincipal",e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal 
                isOpen={isOpenModalEliminar} closeModal={closeModalEliminar} action={() => eliminarUsuario()}
                title= "¿Seguro que desea eliminar a este Usuario?"
                spinner={spinner}
                textButtons={{ confirm: 'Si', denied: 'No' }}
            >
                    <div className="flex gap-8 items-center flex-wrap justify-center">
                        <div className="w-[400px] px-4">
                            <label className="text-center gap-8">Ingrese Comentario de Eliminación </label>
                            <div className="flex items-center gap-4 w-[280px]">
                                <input autoFocus={true} className={`${classNameInput} caret-input`} defaultValue={usuario.motivoEliminacion} onChange={(e) => editarValorUsuario("motivoEliminacion", e.target.value)}/>
                            </div>
                        </div>
                    </div>
            </Modal>   
        </>
    )
}