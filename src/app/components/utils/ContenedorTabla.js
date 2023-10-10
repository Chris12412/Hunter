import React from 'react';

export const ContenedorTabla = ({
    children
}) => {
    return (
        <>
            <div className="mt-7 relative top-0 bottom-0 left-0 right-0 contenedor-tabla">
                {children}
            </div>
        </>
    )
}