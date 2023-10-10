export const AuthFetch = async (url, config = {
    method: 'GET'
}, typeResponse = 'json') => {
    const urlBase = process.env.REACT_APP_BEEDRONE_WEB_API;

    const decifrado = atob(localStorage.getItem('pm-session') || '')
    const datosSession = decifrado == '' ? {} : JSON.parse(decifrado);
    const token = 'Bearer' + ' ' + datosSession?.token;

    const response = await fetch(urlBase + url, {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    if ([401].includes(Number(response.status))) {
        localStorage.clear();
        window.location.reload(false);
    }

    return await response[typeResponse || 'json']()
}


export const AuthFetchOauth = async (url, config = {
    method: 'GET'
}, typeResponse = 'json') => {
    const urlBase = process.env.REACT_APP_OAUTH_WEB_API;
    const decifrado = atob(localStorage.getItem('pm-session') || '')
    const datosSession = decifrado == '' ? {} : JSON.parse(decifrado);
    const token = 'Bearer' + ' ' + datosSession?.token;

    const response = await fetch(urlBase + url, {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': tokenType + ' ' + token
            'Authorization': token
        }
    }).then(async (res) => {
            if (res.status === 401 ){
                localStorage.clear()
                window.location.reload(false) 
            } 
        return res[typeResponse]()
    });

    return response;
}

export const AuthFetchAtu = async (url, config = {
    method: 'GET'
}, typeResponse = 'json') => {
    const urlBase = process.env.REACT_APP_BEEDRONE_WEB_API_ATU;
    const decifrado = atob(localStorage.getItem('pm-session') || '')
    const datosSession = decifrado == '' ? {} : JSON.parse(decifrado);
    const token = 'Bearer' + ' ' + datosSession?.token;

    const response = await fetch(urlBase + url, {
        ...config,
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': tokenType + ' ' + token
            'Authorization': token
        }
    }).then(async (res) => {
            if (res.status === 401 ){
                localStorage.clear()
                window.location.reload(false) 
            } 
        return res[typeResponse]()
    });

    return response;
}


export const Fetch = async ({
    url,
    method,
    headers,
    body,
    typeResponse
}) => {

    const headersDefault = headers || {
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: method || 'GET',
        headers: {
            ...headersDefault,
        },
        body: body || null
    });

    if ([401].includes(Number(response.status))) {
        localStorage.clear();
        window.location.reload(false);
    }

    return await response[typeResponse || 'json']()
}








