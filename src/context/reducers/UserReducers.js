
import { UserTypes } from "../types/UserTypes"

export const UserReducers = (state, action) => {
    switch (action.type) {
        case UserTypes.SIGN_IN:
            return {
                ...state,
                ...action.payload
            }
        case UserTypes.SIGN_OUT:
            return {
                ...state,
                codUsuario: 0,
                nomUsuario: '',
                token: '',      
                tiempoExpiraMiliSegundos: 0,
                tokenType: '',
                codUsuarioTipo: 0,
                codSesion: 0,
                rol: '', 
                apellidoPaterno: '',
                apellidoMaterno: '',
                menus: [],           
                permisos: [] ,
            }
        default:
            throw new Error()
    }
}
















// export const UserReducers = (state, action) => {
//     switch (action.type) {
//         case 'signIn':
//             return {
//                 ...state,
//                 ...action.payload

//                 // nameUser: action.payload.nameUser,
//                 // passwordUser: action.payload.passwordUser,
//                 // token: action.payload.token,
//                 // tokenType: action.payload.tokenType,
//                 // tokenExpire: action.payload.tokenExpire,
//                 // menus: action.payload.menus,
//                 // permisos: action.payload.permisos,
//             }
//         case 'signOut':
//             return {
//                 ...state,
//                 nameUser: '',
//                 passwordUser: '',
//                 token: '',
//                 tokenType: '',
//                 tokenExpire: ''
//             }
//         default:
//             throw new Error()
//     }
// }
