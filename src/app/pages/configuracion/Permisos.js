import React, { useMemo, useReducer } from 'react';
import { ContenedorParametros } from '../../components/utils/ContenedorParametros';
import { AuthFetch } from '../../../services/api';
import { notify } from '../../../utils/utils';
import { isConstructorDeclaration } from 'typescript';


const tipoPermisos = {
    ESTABLECER_DATOS: 'ESTABLECER_DATOS',
}

const inicioPermisos = {
    permisos: [],
    usuarioTipos: []
}

const reducerPermisos = (state, action) => {
    switch (action.type) {
        case tipoPermisos.ESTABLECER_DATOS:
            return {
                ...state,
                ...action.payload
            }
        default:
            throw new Error(`Invalid action ${action.type}`);
    }
}

const usePermisos = () => {
    const [ statePermisos, dispatchPermisos ] = useReducer(reducerPermisos, inicioPermisos);

    const obtenerPermisosPorUsuarioTipo = async () => {
        const respuesta = await AuthFetch('/User/permisosPorUsuariotipo');
        // console.log(respuesta)
        if (respuesta.isValid) {
            dispatchPermisos({ type: tipoPermisos.ESTABLECER_DATOS, payload: {
                permisos: respuesta.content.permisosPorUsuarioTipos,
                usuarioTipos: respuesta.content.usuarioTipos
            }})
        }
    }

    const cambiarEstadoPermiso = async (e, codPermiso, codUsuarioTipo) => {
        const respuesta = await AuthFetch('/User/habilitarPermisos',
        {
            method: 'POST',
            body: JSON.stringify({
                codPermiso: codPermiso,
                codUsuarioTipo: codUsuarioTipo,
                habilitar: e.target.checked
            })
        });
        notify(respuesta.content, respuesta.isValid ? 'success' : 'error');
    }

    useMemo(() => {
        obtenerPermisosPorUsuarioTipo();
    }, []);

    return {
        statePermisos,
        cambiarEstadoPermiso
    }
}

export const Permisos = () => {
    const { statePermisos, cambiarEstadoPermiso } = usePermisos();
    return (
        <>
            <ContenedorParametros
                titulo="Permisos"
            >
            </ContenedorParametros>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Permisos / Tipo de Usuarios</th>
                            {
                                statePermisos.usuarioTipos.map(ut => {
                                    return (
                                        <th key={ut.codUsuarioTipo} className="max-w-[10px]">{ ut.nomUsuarioTipo }</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            statePermisos.permisos.map(p => {
                                return (
                                    <tr key={p.codPermiso}>
                                        <td>{ p.nomPermiso }</td>
                                        {
                                            statePermisos.usuarioTipos.map(ut => {
                                                return (
                                                    <td key={`${p.codPermiso}_${ut.codUsuarioTipo}_body`} className="text-center">
                                                        <input type="checkbox" onChange={(e) => cambiarEstadoPermiso(e, p.codPermiso, ut.codUsuarioTipo)} defaultChecked={p.usuarioTipos[ut.nomUsuarioTipo] == 1 ? true : false} />
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}