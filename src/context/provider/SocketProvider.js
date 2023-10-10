import React, { createContext, useReducer, useEffect, useState } from "react";
import { SocketReducers } from '../reducers/SocketReducers'
import mqtt from 'mqtt/dist/mqtt';

export const SocketContext = createContext();

export function SocketProvider(props) {
    const [ subscription, setSubscription ] = useState(false);

    const initialState = {
        connectStatus: localStorage.getItem('connect-status') || 'Connect',
        client: false, //JSON.parse(localStorage.getItem('client')) || false,
        isSubed: false,
        payload: {}
    }

    const [ state, dispatch ] = useReducer(SocketReducers, initialState);

    useEffect(() => {
        if (state.connectStatus === 'Connected' || state.connectStatus === 'Reconnecting') {
            mqttConnect()
        }
    }, [])

    useEffect(() => {
        if (state.client) {
            state.client.on('connect', () => {
                dispatch({ type: 'setConnectStatus', payload: 'Connected' });
            });

            state.client.on('error', (err) => {
                console.error('Connection error: ', err);
                state.client.end();
            });

            state.client.on('reconnect', () => {
                dispatch({ type: 'setConnectStatus', payload: 'Reconnecting' });
                setTimeout(() => {
                    // mqttConnect()
                }, 5000)
            });

            state.client.on('message', (topic, message) => {
                const payload = { topic, message: JSON.parse(message.toString()) };
                dispatch({ type: 'setPayload', payload: payload });
            });
        }
    }, [state.client]);

    useEffect(() => {
        if (subscription) {
            mqttSub(subscription)
        }
    }, [subscription])

    const mqttConnect = () => {
        const host = process.env.REACT_APP_MQTT_HOST;
        const port = process.env.REACT_APP_MQTT_PORT;
        const protocol = process.env.REACT_APP_MQTT_PROTOCOL;
        const url = `${protocol}://${host}:${port}/mqtt`
        
        const options = {
            keepalive: 30,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            rejectUnauthorized: false
        };
        
        options.clientId = `plamin.+ ${Math.random().toString(16).substr(2, 8)}`;

        const topic = process.env.REACT_APP_MQTT_TOPIC;
        const qos = 0;

        dispatch({ type: 'setConnectStatus', payload: 'Connecting' });
        const newClient = mqtt.connect(url, options);

        dispatch({ type: 'setClient', payload: newClient});
        setSubscription({ topic, qos } || false)
    }

    const mqttDisconnect = () => {
        if (state.client) {
            state.client.end(() => {
                dispatch({ type: 'setConnectStatus', payload: 'Disconnect' });
            });
        }
    }
    
    const mqttPublish = (context) => {
        if (state.client) {
            const { topic, qos, payload } = context;
            state.client.publish(topic, payload, { qos }, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    }
    
    const mqttSub = (subscription) => {
        if (state.client) {
            const { topic, qos } = subscription;
            state.client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                dispatch({ type: 'setIsSub', payload: true });
                console.log(`Se suscribió al topico: ${topic}`)
            });
        }
    };
    
    const mqttUnSub = (subscription) => {
        if (state.client) {
            const { topic } = subscription;
            state.client.unsubscribe(topic, error => {
                if (error) {
                    console.log('Unsubscribe error', error)
                    return
                }
                dispatch({ type: 'setIsSub', payload: false });
            });
        }
    };

    return (
        <SocketContext.Provider value={{ stateSocket: state, mqttConnect, mqttDisconnect, mqttPublish, mqttSub, mqttUnSub }}>
            { props.children }
        </SocketContext.Provider>
    )
}
















// import React, { createContext, useReducer, useEffect, useState } from "react";
// import { SocketReducers } from '../reducers/SocketReducers'
// import mqtt from 'mqtt/dist/mqtt';

// export const SocketContext = createContext();

// export function SocketProvider(props) {
//     const [ subscription, setSubscription ] = useState(false);

//     const initialState = {
//         connectStatus: localStorage.getItem('connect-status') || 'Connect',
//         client: false, //JSON.parse(localStorage.getItem('client')) || false,
//         isSubed: false,
//         payload: {}
//     }

//     const [ state, dispatch ] = useReducer(SocketReducers, initialState);

//     useEffect(() => {
//         if (state.connectStatus === 'Connected') {
//             const host = process.env.REACT_APP_MQTT_HOST;
//             const port = process.env.REACT_APP_MQTT_PORT;
//             const protocol = process.env.REACT_APP_MQTT_PROTOCOL;
//             const url = `${protocol}://${host}:${port}/mqtt`
            
//             const options = {
//                 keepalive: 30,
//                 protocolId: 'MQTT',
//                 protocolVersion: 4,
//                 clean: true,
//                 reconnectPeriod: 1000,
//                 connectTimeout: 30 * 1000,
//                 rejectUnauthorized: false
//             };
            
//             options.clientId = `beex.+ ${Math.random().toString(16).substr(2, 8)}`;
//             options.username = localStorage.getItem('name-user');

//             const topic = process.env.REACT_APP_MQTT_TOPIC;
//             const qos = 0;

//             mqttConnect(url, options, { topic, qos })
//         }
//     }, [])

//     useEffect(() => {
//         if (state.client) {
//             state.client.on('connect', () => {
//                 dispatch({ type: 'setConnectStatus', payload: 'Connected' });
//             });

//             state.client.on('error', (err) => {
//                 console.error('Connection error: ', err);
//                 state.client.end();
//             });

//             state.client.on('reconnect', () => {
//                 dispatch({ type: 'setConnectStatus', payload: 'Reconnecting' });
//             });

//             state.client.on('message', (topic, message) => {
//                 const payload = { topic, message: message.toString() };
//                 dispatch({ type: 'setPayload', payload: payload });
//             });
//         }
//     }, [state.client]);

//     useEffect(() => {
//         if (subscription) {
//             mqttSub(subscription)
//         }
//     }, [subscription])

//     const mqttConnect = (host, options, subscription) => {
//         dispatch({ type: 'setConnectStatus', payload: 'Connecting' });
//         const newClient = mqtt.connect(host, options);
//         dispatch({ type: 'setClient', payload: newClient});
//         setSubscription(subscription || false)
//     }

//     const mqttDisconnect = () => {
//         if (state.client) {
//             state.client.end(() => {
//                 dispatch({ type: 'setConnectStatus', payload: 'Disconnect' });
//             });
//         }
//     }
    
//     const mqttPublish = (context) => {
//         if (state.client) {
//             const { topic, qos, payload } = context;
//             state.client.publish(topic, payload, { qos }, error => {
//                 if (error) {
//                     console.log('Publish error: ', error);
//                 }
//             });
//         }
//     }
    
//     const mqttSub = (subscription) => {
//         if (state.client) {
//             const { topic, qos } = subscription;
//             state.client.subscribe(topic, { qos }, (error) => {
//                 if (error) {
//                     console.log('Subscribe to topics error', error)
//                     return
//                 }
//                 dispatch({ type: 'setIsSub', payload: true });
//                 console.log(`Se suscribió al topico: ${topic}`)
//             });
//         }
//     };
    
//     const mqttUnSub = (subscription) => {
//         if (state.client) {
//             const { topic } = subscription;
//             state.client.unsubscribe(topic, error => {
//                 if (error) {
//                     console.log('Unsubscribe error', error)
//                     return
//                 }
//                 dispatch({ type: 'setIsSub', payload: false });
//             });
//         }
//     };

//     return (
//         <SocketContext.Provider value={{ stateSocket: state, mqttConnect, mqttDisconnect, mqttPublish, mqttSub, mqttUnSub }}>
//             { props.children }
//         </SocketContext.Provider>
//     )
// }