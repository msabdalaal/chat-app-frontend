import { useContext, useEffect } from "react";
import { SocketContext } from "../Contexts/SocketContext";
import { MainContext } from "../Contexts/MainContext";
import { produce } from "immer";

const useListenMessages = () => {
  const { socket } = useContext(SocketContext);
  const { setAllMessage, setChatList } = useContext(MainContext);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setAllMessage(
        produce((draft) => {
          const messages = draft[message.chatId];
          messages?.push(message);
        })
      );
      setChatList(
        produce((draft) => {
          if (draft.chats.find((chat) => chat._id == message.chatId)) {
            const chat = draft.chats.find((chat) => chat._id == message.chatId);
            chat.lastMessage = message;
          } else {
            const chat = draft.groupChats.find(
              (chat) => chat._id == message.chatId
            );
            chat.lastMessage = message;
          }
        })
      );
    });

    socket?.on("readMessages", ({ chatId, userId }) => {
      setAllMessage(
        produce((draft) => {
          const messages = draft[chatId];

          if (messages) {
            messages.forEach((message) => {
              if (!message.readBy.includes(userId)) {
                message.readBy?.push(userId);
              }
            });
          }
        })
      );
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("readMessages");
    };
  }, [setAllMessage, setChatList, socket]);
};

export default useListenMessages;
