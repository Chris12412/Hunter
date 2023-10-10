
import React, { useContext } from 'react';
import {Redirect, useLocation} from "react-router-dom";
import { UserContext } from '../../context/provider/UserProvider';

import { PrivateRoutes } from './PrivateRoutes'
import { PublicRoutes } from './PublicRoutes'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RoutesJSX = () => {
    const { stateUser } = useContext(UserContext)
    localStorage.setItem('currentLocation', useLocation().pathname)
    return (
        <>
            {
                !stateUser.token && <Redirect to='/'></Redirect>
            }
            <PublicRoutes></PublicRoutes>
            <PrivateRoutes token={stateUser.token}></PrivateRoutes>
            <ToastContainer></ToastContainer>
        </>
    )
}























// import React from 'react';

// import {
//     Switch,
//     Redirect
// } from "react-router-dom";

// import { PrivateRoutes } from './PrivateRoutes'
// import { PublicRoutes } from './PublicRoutes'

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // const NotFound = () => <h1>No encontrado</h1>

// export const RoutesJSX = () => {

//     return (
//         <>
                    
//                     {/* <Route exact path='/login' component={() => {
//                         console.log(state.token )
//                         return state.token === '' ? <Login></Login> : <Redirect exac to='/recargas'></Redirect> 
//                     }} />   
//                     <Route exact path='/' component={Inicio} />
//                     <LayoutMaster>
//                         <PrivateRoute path='/recargas' component={Recargas} />
//                         <PrivateRoute path='/personas' component={Personas} />
//                         <PrivateRoute path='/profile' component={ProfilePage} />
//                     </LayoutMaster> */}
//                     {
//                         !localStorage.getItem('token') && <Redirect to='/login'></Redirect>
//                     }
//                     <Switch>
//                         <Redirect exact from="/" to={localStorage.getItem('currentLocation') ? localStorage.getItem('currentLocation') : '/login' }></Redirect>
//                     </Switch>
//                     <PublicRoutes></PublicRoutes>
//                     <PrivateRoutes></PrivateRoutes>
//                     <ToastContainer></ToastContainer>
//         </>
//     )
// }