import { useState }from "react";
import { AuthFetch } from "../services/api";
import { useModal } from "./useModal";

export const useHistorialRecargas = () =>{
    const [isOpenHistorial, openModalHistorial, closeModalHistorial] = useModal();
    const [recargaHistorial , setRecargaHistorial ] = useState([]);


    const listarHistorialRecargas = async (codUsuario) => {
        const response = await AuthFetch(`/Recharge/listarHistorialRecargaUsuario?` + new URLSearchParams({
            codUsuario: codUsuario 
        }))
        if (response.isValid){
            setRecargaHistorial(response.content)
        }
        openModalHistorial();
    }
    

    return { listarHistorialRecargas, recargaHistorial, isOpenHistorial, closeModalHistorial}; 

}