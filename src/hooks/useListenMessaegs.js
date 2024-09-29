import { useContext, useEffect } from "react";
import { SocketContext } from "../Contexts/SocketContext";
import { MainContext } from "../Contexts/MainContext";
import { produce } from "immer";

const useListenMessages = () => {
  const { socket } = useContext(SocketContext);
  const { setAllMessage } = useContext(MainContext);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setAllMessage(
        produce((draft) => {
          const messages = draft[message.chatId];
          messages?.push(message);
        })
      );
    });
    return () => socket?.off("newMessage");
  }, [setAllMessage, socket]);
};

export default useListenMessages;
