import { useContext, useEffect } from "react";
import { SocketContext } from "../Contexts/SocketContext";
import { MainContext } from "../Contexts/MainContext";
import { produce } from "immer";

const useListenChats = () => {
  const { socket } = useContext(SocketContext);
  const { setChatList } = useContext(MainContext);

  useEffect(() => {
    socket?.on("newChat", (newChat) => {
      setChatList(
        produce((draft) => {
          if (newChat.isGroupChat) {
            if (draft) {
              draft.groupChats.push(newChat);
            }
          } else {
            if (draft) {
              draft.chats.push(newChat);
            }
          }
        })
      );
      if (document.visibilityState === "hidden") {
        if (Notification.permission === "granted") {
          new Notification("New Chat Created", {
            body: "New Chat Created",
            icon: "icon.png",
          });
        }
      }
    });


    return () => {
      socket?.off("newChat");
    };
  }, [setChatList, socket]);
};

export default useListenChats;
