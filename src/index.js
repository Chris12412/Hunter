import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './assets/css/views/index.css';
import { notify } from './utils/utils';

// window.addEventListener("beforeunload", (evento) => {
//     notify('Antes de Salir, tiene que Cerrar su Sesión','error')
//     if (true) {
//         evento.preventDefault();
//         evento.returnValue = "";
//         return "";
//     }
// });
    
ReactDOM.render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>,
    document.getElementById('root')
)   

serviceWorkerRegistration.register();
