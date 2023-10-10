import React, { useEffect, useState, useRef } from 'react';
import { ContenedorParametros } from "../components/utils/ContenedorParametros";
import { ContenedorTabla } from '../components/utils/ContenedorTabla';
import { useSugerencias } from '../../hooks/useSugerencias';
import { DatePickerABX } from '../components/pickers/DatePicker'



export const ChatOnline =()=>{
    const {sugerencia, listarSugerencia} = useSugerencias();
    const [ startDate, setStartDate ] = useState(new Date())
    const [ endDate, setEndDate ] = useState(new Date());
    useEffect(() => {
        listarSugerencia();
    }, []);

    return(
        <>
            <ContenedorParametros titulo="Buzón de sugerencia">
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
                                {/* <th className="">CODIGO DE SUGERENCIA</th> */}
                                <th className="text-left">NOMBRE</th>
                                <th className="text-center">NRO. DOC</th>
                                <th className="text-left">DETALLE SUGERENCIA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   sugerencia.length > 0 ?
                                sugerencia.map((sugerencia , i)=>{
                                    return <tr key={sugerencia.CodSugerencia}>
                                                <td>{i+1}</td>
                                                {/* <td className="text-center">{sugerencia.codSugerencia}</td> */}
                                                <td className="text-left">{sugerencia.nomPersona}</td>
                                                <td className="text-center">{sugerencia.nroDocumento}</td>
                                                <td className="text-left">{sugerencia.comentarioSugerencia}</td>
                                            </tr>
                                }):''
                            }
                        </tbody>
                    </table>
                </div>
            </ContenedorTabla>
        </>
    
    
    )
    
    
}