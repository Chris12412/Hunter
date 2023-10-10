import React, { useContext, useEffect } from 'react'
import {
    Switch,
    Route,
    Redirect,
    useRouteMatch,
    useParams
} from "react-router-dom";
import { UserContext } from '../../context/provider/UserProvider';

import { LayoutMaster } from '../modules/layout/LayoutMaster';
import { PrivateRoute } from '../components/PrivateRoute';

import { Recargas } from '../pages/Recargas'
import { UsuariosAplicativo } from '../pages/UsuariosAplicativo'
import { ProfilePage } from '../modules/profile/ProfilePage'

import { SocketContext } from '../../context/provider/SocketProvider'
import { notify } from '../../utils/utils'
import { UsuariosPlataforma } from '../pages/UsuariosPlataforma';
import { Historial } from '../pages/Historial';
import { PersonasPlataforma } from '../pages/PersonasPlataforma';
import { EnlaceUnidades } from '../pages/EnlaceUnidades';
import { Permisos } from '../pages/configuracion/Permisos';
import { LibroReclamaciones } from '../pages/LibroReclamaciones';
import { ChatOnline } from '../pages/ChatOnline';
import { BuzonSugerencias } from '../pages/BuzonSugerencias';
import PageNotFound from '../pages/PageNotFound';



export function PrivateRoutes({ token }) {

    return (
        <>
            {
                token !== '' && localStorage.getItem('currentLocation') !== '/'
                && (
                    <LayoutMaster>
                        <Switch>
                            <PrivateRoute path='/recargas' component={Recargas} />
                            <PrivateRoute path='/usuariosBeex' component={UsuariosAplicativo} />
                            <PrivateRoute path='/profile' component={ProfilePage} />    
                            <PrivateRoute path='/usuariosWeb' component={UsuariosPlataforma} />    
                            <PrivateRoute path='/historial' component={Historial}/>
                            <PrivateRoute path='/personasPlataforma' component={PersonasPlataforma}/>
                            <PrivateRoute path='/enlaceUnidades' component={EnlaceUnidades}/>
                            <PrivateRoute path='/posteos' component={ProfilePage}/>
                            <PrivateRoute path='/permisos' component={Permisos}/>
                            <PrivateRoute path='/libroReclamaciones' component={LibroReclamaciones}/>
                            <PrivateRoute path='/chatOnline' component={ChatOnline}/>
                            <PrivateRoute path='/buzonSugerencias' component={BuzonSugerencias}/>
                            <Route path="*" component={PageNotFound}/>
                        </Switch>
                    </LayoutMaster>
                )
            }




























{/* 

            {
                state.token !== ''
                ? (
                    <LayoutMaster>
                        <Switch>
                            <PrivateRoute path='/recargas' component={Recargas} />
                            <PrivateRoute path='/usuariosBeex' component={UsuariosAplicativo} />
                            <PrivateRoute path='/profile' component={ProfilePage} />    
                            <PrivateRoute path='/usuariosWeb' component={UsuariosPlataforma} />    
                            <PrivateRoute path='/historial' component={Historial}/>
                            <PrivateRoute path='/personasPlataforma' component={PersonasPlataforma}/>
                            <PrivateRoute path='/enlaceUnidades' component={EnlaceUnidades}/>
                            <PrivateRoute path='/posteos' component={ProfilePage}/>
                            <PrivateRoute path='/permisos' component={Permisos}/>
                            
                        </Switch>
                        <Redirect from='/' to={{
                            pathname: state.token === '' ? '/login' : '/recargas'
                        }}></Redirect> 
                    </LayoutMaster>
                )
                : (
                    <Switch>
                        <PrivateRoute path='/recargas' component={Recargas} />
                        <PrivateRoute path='/personas' component={UsuariosAplicativo} />
                        <PrivateRoute path='/profile' component={ProfilePage} />
                        <PrivateRoute path='/UsuariosPlataforma' component={UsuariosPlataforma} />
                        <PrivateRoute path='/historial' component={Historial}/>
                        <PrivateRoute path='/personasPlataforma' component={PersonasPlataforma}/>
                        <PrivateRoute path='/enlaceUnidades' component={EnlaceUnidades}/>
                        <PrivateRoute path='/posteos' component={ProfilePage}/>
                        <PrivateRoute path='/permisos' component={Permisos}/>

                        <Redirect from='/' to={{
                            pathname: state.token === '' ? '/login' : '/recargas'
                        }}></Redirect> 
                    </Switch>
                )
            }  */}
        </>
    )
}