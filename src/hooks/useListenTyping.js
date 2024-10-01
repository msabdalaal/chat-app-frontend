import { useContext, useEffect } from "react";
import { SocketContext } from "../Contexts/SocketContext";
import { MainContext } from "../Contexts/MainContext";
import { produce } from "immer";

const useListenTyping = () => {
  const { socket } = useContext(SocketContext);
  const { setTyping } = useContext(MainContext);

  useEffect(() => {
    socket?.on("displayTyping", ({ userId, chatId }) => {
      setTyping(
        produce((draft) => {
          draft.push({ chatId, userId });
        })
      );
    });
    socket?.on("hideTyping", ({ chatId }) => {
      setTyping(
        produce((draft) => {
          return draft.filter((t) => t.chatId !== chatId);
        })
      );
    });
    return () => {
      socket?.off("displayTyping");
      socket?.off("hideTyping");
    };
  }, [setTyping, socket]);
};

export default useListenTyping;
