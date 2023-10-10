import React from "react";
import { Spinner } from '../utils/Spinner'
import { useSpinner } from "../../../hooks/useSpinner";
import Draggable from "react-draggable";

export const ModalRecarga = ({
    isOpen, closeModal, actionRecargar,actionDenegar, width, children, title, spinner, 
    textButtons = { confirm: 'Recargar', denied: 'Denegar',cancel:'Cancelar'},
    validButton = { confirm: true , denied: true, cancel:true}
}) => {
    return (
    <>  
        {isOpen ? (
            <>
            <Draggable handle="strong" role="dialog" aria-modal="true">
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[1050] outline-none focus:outline-none">
                    <div className={`relative w-${width ? width : 'auto'} my-6 mx-auto max-w-[90%]`}>
                    {/*content*/}
                        <div className="bg-[#2d2f30] border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <strong>

                            <div className=" divMovibleCabecera bg-[#003478]  flex items-start justify-between p-5 border-b border-solid border-[#4e4e4e] rounded-t">
                                <h3 className="text-xl font-semibold">
                                    {title}
                                </h3>
                                <button
                                    className=""
                                    onClick={closeModal}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            </strong>

                            {/*body*/}
                            <div className="relative p-6 flex-auto bg-[#2f3134]">
                                { children }
                            </div>
                            {/*footer*/}
                            <div className="bg-[#2d2f30] flex items-center justify-end p-3 rounded-b">
                            {validButton.confirm ?
                                <button
                                    className="min-w-[150px] bg-green-500 hover:bg-green-600 text-white active:bg-green-600 font-bold capitalize text-[18px] px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-xs"
                                    type="button"
                                    onClick={actionRecargar}
                                >
                                    {
                                        spinner 
                                        ? <Spinner></Spinner>
                                        : <span>{textButtons.confirm}</span>
                                    }
                                </button>
                                : ''
                            }
                            {validButton.denied ?
                                <button
                                    className="min-w-[150px] bg-red-500 hover:bg-red-600 text-white active:bg-red-600 font-bold capitalize text-[18px] px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-xs"
                                    type="button"
                                    onClick={actionDenegar}
                                >
                                    {
                                        <span>{textButtons.denied}</span>
                                    }
                                </button>
                                : ''
                            }
                                {validButton.cancel ?
                                    <button
                                        className="text-white-500 bg-gray-700 hover:bg-gray-500 rounded background-gray font-bold capitalize px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-xs"
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        {
                                            <span>{textButtons.cancel}</span>
                                        }
                                    </button>
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
                </Draggable>
            </>
        ) : null}
        </>
    );
}