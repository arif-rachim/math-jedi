import React, {createContext, useCallback, useContext, useState} from "react";
import Horizontal from "./Horizontal";
import {uuidv4} from "./utils";
import Vertical from "./Vertical";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

const NOTIFICATION_BACKGROUND_COLOR = {
    info: 'green',
    warning: 'yellow',
    error: 'red'
};

function Notification({style, notification: {message, closeNotification, id, type}}) {
    const inlineStyle = {
        padding: '5px 10px 10px 10px',
        color: 'white',
        backgroundColor: NOTIFICATION_BACKGROUND_COLOR[type],
        borderRadius: 5,
        fontSize: '1.8rem',
        boxShadow: '0px 5px 3px -3px rgba(0,0,0,0.3)'
    };
    return <Horizontal style={{...style, ...inlineStyle}} gap={10} verticalAlign={'center'}>
        <div>
            {message}
        </div>
        <FontAwesomeIcon icon={faTimesCircle} size="1x" style={{cursor:'pointer'}} onClick={closeNotification}/>
    </Horizontal>
}

const DEFAULT_NOTIFICATIONS = [];

const NotificationContext = createContext();

export function NotificationContextProvider({children}) {
    const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
    return <NotificationContext.Provider value={{notifications, setNotifications}}>
        {children}
        <Vertical style={{position: 'fixed', top: 10, width: '100%'}} gap={5} horizontalAlign={'center'}>
            {notifications.map(notification => <Notification key={notification.id} notification={notification}/>)}
        </Vertical>
    </NotificationContext.Provider>
}

export function useNotification() {
    const {setNotifications} = useContext(NotificationContext);
    const showNotification = useCallback(({message, type}) => {
        const id = uuidv4();
        const closeNotification = () => {
            setNotifications((notifications) => notifications.filter(notification => notification.id !== id));
        };
        setNotifications((oldNotifications) => [...oldNotifications, {id, message, type, closeNotification}]);
        return closeNotification;
    }, [setNotifications]);
    return {
        info: (message) => showNotification({message, type: 'info'}),
        warning: (message) => showNotification({message, type: 'warning'}),
        error: (message) => showNotification({message, type: 'error'})
    };
}
