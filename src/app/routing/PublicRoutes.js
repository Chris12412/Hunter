import React, { useContext } from 'react'
import {
    Switch,
    Route,
    Redirect,
    useLocation
} from "react-router-dom";
// import {Web} from '../pages/Web'
import { Login } from '../pages/Login'


export function PublicRoutes() {
    return (
        <>
            <Switch>             
                <Route exact path='/' component={Login} />  
                <Route exact path='/Login' component={Login} />  
            </Switch>
        </>
    )
}

