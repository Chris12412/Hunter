import { toast } from 'react-toastify';

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}

export const formatDate = (date, format = 103) => {
    let stringFormat = ''
    if (date === '' ){
        return ;
    }else{
        switch  (format) {
            case 23:
            stringFormat = [
                date.getFullYear(), 
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate())
            ].join('-');
            break;
            case 103:
                stringFormat = [
                    padTo2Digits(date.getDate()),
                    padTo2Digits(date.getMonth() + 1),
                    date.getFullYear()
                ].join('/');
                break;
                default:
                }
                
                return stringFormat;
            }
}

export const notify = (title, type, options = {}) => {
    toast[type](title, {
        position: options.position ?? "top-right",
        autoClose: options.autoClose ?? 2000,
        hideProgressBar: options.hideProgressBar ?? false,
        closeOnClick: options.closeOnClick ?? true,
        pauseOnHover: options.pauseOnHover ?? true,
        draggable: true,
        progress: undefined,
    });
}

export const soloDecimal = (e, elemento) => {
    const key = e.keyCode ? e.keyCode : e.which

    if (key === 8) return true
    
    if (key > 47 && key < 58) {
        if (elemento.value === "") return true
        const regexp = /.[0-9]{9}$/

        if(!(regexp.test(elemento.value))) {
            return true
        }
    }

    if (key === 46) {
        if (elemento.value === "") return false
        const regexp = /^[0-9]+$/
        console.log("s ", regexp.test(elemento.value))
        if (regexp.test(elemento.value)) {
            return true
        }
    }
    
    e.preventDefault()
}

export const formatState = (codState, nameState) => {
    let htmlrespuesta = '';
    let className = ''

    if ([4,50,51].includes(codState)) className = 'cursor-pointer bg-green-500 px-2 py-[2px] rounded uppercase text-[11px] font-bold'
    else if ([1,3].includes(codState)) className = 'cursor-pointer bg-blue-500 px-2 py-[2px] rounded uppercase text-[11px] font-bold'
    else if ([5,6,2].includes(codState)) className = 'cursor-pointer bg-red-500 px-2 py-[2px] rounded uppercase text-[11px] font-bold'
    else if ([7,52].includes(codState)) className = 'cursor-pointer bg-red-800 px-2 py-[2px] rounded uppercase text-[11px] font-bold'
    else if ([8].includes(codState)) className = 'cursor-pointer bg-black-800 px-2 py-[2px] rounded uppercase text-[11px] font-bold'
    else if ([9].includes(codState)) className = 'cursor-pointer bg-yellow-500 px-2 py-[2px] rounded uppercase text-[11px] font-bold'

    return className;
}

export const soloCelular = (event, element) => {
    const key = event.keyCode ? event.keyCode : event.which
    if (key === 8) return true
    if (key > 47 && key < 58) {
        if (element.value === "") return true
        const regexp = /.[0-9]{8}$/
        if(!(regexp.test(element.value))) {
            return true
        }
    }
    event.preventDefault()
}

export const soloNumero = (event, element) => {
    const key = event.keyCode ? event.keyCode : event.which
    if (key === 8) return true
    if (key > 47 && key < 58) {
        if (element.value === "") return true
        const regexp = /.[0-9]{20}$/
        if(!(regexp.test(element.value))) {
            return true
        }
    }
    event.preventDefault()
}

export const soloDNI = (event, element) => {
    const key = event.keyCode ? event.keyCode : event.which
    if (key === 8) return true
    if (key > 47 && key < 58) {
        if (element.value === "") return true
        const regexp = /.[0-9]{7}$/
        if(!(regexp.test(element.value))) {
            return true
        }
    }
    event.preventDefault()
}

export const primeraLetraMayuscula = (string) => {
    var str = string;

    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });

    return str; 
}

export const todoMayuscula = (string)=> {
    var str = string;
    str = str.toUpperCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return str;
}

export const quitarTildes = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 


