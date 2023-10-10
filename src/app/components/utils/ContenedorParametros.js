import React from 'react';
import { LabelTituloGeneral } from './LabelTituloGeneral';
import { SearchTable }  from './SearchTable';

export const ContenedorParametros = ({
    titulo = '',
    children,
    tablaId = null,
}) => {
    return (
        <>
            <div className="" style={{alignItems: 'center',boxShadow: '0 10px 10px 0 rgba(255,255,255,0.2)'}}>
                <div className=" min-h-[48px] h-auto  flex items-center px-[15px] justify-between flex-wrap	">
                    <div className='flex gap-[14px] items-center flex-wrap	'>
                        {children}                        
                    </div>
                    <LabelTituloGeneral titulo={titulo}/>  
                </div>
                {tablaId && <SearchTable tablaId={tablaId}/> }
            </div>
        </>
    )
}