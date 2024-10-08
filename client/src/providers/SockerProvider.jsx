import React, { createContext, useMemo } from 'react'
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {

    const socket = useMemo(() => io(process.env.REACT_APP_SOCKET_BACKEND_URL), []);

  return (
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  )
}