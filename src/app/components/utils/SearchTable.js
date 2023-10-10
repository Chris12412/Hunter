import React,{useRef, useState} from "react";

export const SearchTable = ({ tablaId }) => {
    const [ verInput, setVerInput ] = useState() 
    const getByFilter = async (value) =>{
        const tabla = document.querySelector('#' + tablaId);
        const rows = tabla.children[1].children;
        const expresion = new RegExp(`${value}.*`, "i")

        for (let i = 0; i < rows.length; i++) {
            const cols = rows[i].children;
            let ocultar = true;

            for(let j = 0; j < cols.length; j++) {
                const value = cols[j].innerHTML;
                
                const booool = expresion.test(value);
                if (booool) {
                    ocultar = false;
                    break;
                }
            }
            rows[i].style.display = ocultar ? "none" : "";
        }
    }
    const  btnBuscar = useRef() 
    const inputBuscar = useRef()
    const divPrueba = useRef()

    const mostrarInput = () => {
        verInput ? setVerInput(false) : setVerInput(true);
    }

    return (
    <>
        <div className="absolute right-[34px]" style={{zIndex:44}}>
            <div className="absolute w-[39px] active" > 
                <input href={inputBuscar} onChange={e => getByFilter(e.target.value)} 
                    className={ ` ${verInput ? '': ' hidden ' } mt-4 text-white h-[30px]  px-4 w-[180px] bg-zinc-800 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500 caret-input absolute text-[#FFFFFF] right-[5px] bg-[#27272a] rounded-md border-[#171313] pl-[10px]" `} 
                    type="text" placeholder="Búsqueda" autoComplete="off" autoFocus={ true }
                />
            </div>
            <div id="divBtnBuscar" href={divPrueba}>
                <button href={btnBuscar} onClick={mostrarInput} className="mt-[12px] absolute p-2 pr-3 rounded-l-lg infoBusqueda bg-[#27272a] tooltipstered mt-[2px] text-[#FFFFFF]">
                    <i className="fa fa-search " aria-hidden="true" />
                </button>
            </div>
        </div>
    </>
    );
}