export const SocketReducers = (state, action) => {
    switch (action.type) {
        case 'setConnectStatus':
            localStorage.setItem('connect-status', action.payload)
            return {
                ...state,
                connectStatus: action.payload
            }
        case 'setClient':
            return {
                ...state,
                client: action.payload
            }
        case 'setPayload':
            return {
                ...state,
                payload: action.payload
            }
        case 'setIsSub':
            return {
                ...state,
                isSubed: action.payload
            }
        default:
            throw new Error()
    }
}
