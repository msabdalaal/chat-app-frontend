import { createContext, useContext, useEffect, useState } from "react";
import { MainContext } from "./MainContext";
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_URL;

export const SocketContext = createContext();

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { loggedUser } = useContext(MainContext);
  useEffect(() => {
    if (loggedUser) {
      const socket = io(BASE_URL, {
        query: {
          userId: loggedUser._id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [loggedUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
