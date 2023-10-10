import React from 'react';
import { useEstados } from '../../../hooks/useEstados';
import { primeraLetraMayuscula } from '../../../utils/utils';

export const BotonesEstado = ({listarRecargas, estadoActual,fechaInicio,fechaFin }) => {
    const [ estados ] = useEstados();
    
    return (
        <div className='absolute z-10000000'>
                {
                    estados.map (e => {
                        let color = 'text-white-400'
                        if (e.codEstado === 50){///Nuevo
                            color = 'text-blue-400'
                        } else if(e.codEstado === 51){//Aceptado
                            color = 'text-green-400'
                        }else if (e.codEstado === 52){//Rechazado
                            color= 'text-red-500'
                        }else if (e.codEstado === 52){//Denegado
                            color= 'text-red-700'
                        }

                        // 50 -> NUEVO
                        // 51 -> ACEPTADO
                        // 52 -> DENEGADO
                        return <button onClick={() => listarRecargas(fechaInicio,fechaFin,e.codEstado)} key={e.codEstado} style={{boxShadow:'rgba(51, 111, 187, 0.5) 0px 30px 60px -12px inset, #336fbb 0px 18px 36px -18px inset',border:'1px solid #336fbb'}}  className={`${estadoActual === e.codEstado ? ' bg-[#2e5289] ':'  '}]   hover:bg-[#2e5289] mr-[1px] px-1 py-1 lg:px-2 lg:py-1 `}><i className={`fa fa-circle ${color}`} style={{fontSize:'13px'}}></i>{primeraLetraMayuscula(e.nomEstado)}</button>
                    })
                }
                <button onClick={() => listarRecargas(fechaInicio,fechaFin,0)} style={{boxShadow:'rgba(51, 111, 187, 0.5) 0px 30px 60px -12px inset, #336fbb 0px 18px 36px -18px inset',border:'1px solid #336fbb'}} className={`${estadoActual === 0 ? ' bg-[#2e5289] ':'    '}]   hover:bg-[#2e5289] mr-[2px] px-1 py-1 lg:px-2 lg:py-1`}><i className="fa fa-circle text-[#bcbdbf] rounded-xl border-white border" style={{fontSize:'13px'}}></i>Todos</button>       
        </div>  
    )
} 
