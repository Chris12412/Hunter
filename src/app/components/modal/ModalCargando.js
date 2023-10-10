import React from "react";

export const ModalCargando = ({
    isOpen, closeModal
}) => {
    return (
    <>  
        {isOpen ? (
            <>
                <div className="loading">Loading
                    <div className="spinner-sec spin-sec-one"></div>
                    <div className="spinner-sec spin-sec-two"></div>
                    <div className="spinner-sec spin-sec-three"></div>
                </div>
            </>
        ) : null}
        </>
    );
}