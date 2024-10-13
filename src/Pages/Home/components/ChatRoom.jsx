import { useCallback, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import { Logout, MoreVert } from "@mui/icons-material";
import MessageInput from "./MessageInput";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { DELETE, GET, PATCH, POST } from "../../../api/axios";
import { MainContext } from "../../../Contexts/MainContext";
import ChatMenu from "./ChatMenu";
import dayjs from "dayjs";
import { getNameInitials } from "../../../utils/helpers/getNameInitials";
import { stringToColor } from "../../../utils/helpers/getColorFromString";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";
import { produce } from "immer";
import UserProfileModal from "./UserProfileModal";
import useListenMessages from "../../../hooks/useListenMessaegs";
import useListenTyping from "../../../hooks/useListenTyping";
import TypingIndicator from "./TypingIndicator";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { motion } from "framer-motion";
const ChatRoom = ({ showGroups }) => {
  const [newMessage, setNewMessage] = useState("");
  const [anchorEls, setAnchorEls] = useState({});
  const [chatMenuAnchorEl, setChatMenuAnchorEl] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  useListenMessages();
  const {
    currentChat,
    loggedUser,
    allMessage,
    setAllMessage,
    setChatList,
    setSending,
    mainColor,
    typing,
    setCurrentChat,
  } = useContext(MainContext);

  const lastMessageRef = useRef(null);
  const typingRef = useRef(null);

  useListenTyping();

  const scrollToBottom = useCallback(() => {
    if (typing?.find((item) => item.chatId === currentChat._id)) {
      if (typingRef.current) {
        typingRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat._id, typing]);
  useEffect(() => {
    scrollToBottom();
  }, [allMessage, currentChat, scrollToBottom, typing]);
  const readMessages = useCallback(async () => {
    if (currentChat) {
      await PATCH(`/api/messages/read/${currentChat._id}`).then((response) => {
        if (response.data.success) {
          setChatList(
            produce((draft) => {
              const list = draft[currentChat.isGroup ? "groupChats" : "chats"];
              list.forEach((chat) => {
                if (
                  chat._id === currentChat._id &&
                  !chat.lastMessage?.readBy?.includes(loggedUser._id)
                ) {
                  chat.lastMessage?.readBy?.push(loggedUser._id);
                }
              });
            })
          );
        }
      });
    }
  }, [currentChat, setChatList, loggedUser._id]);

  useEffect(() => {
    readMessages();
  }, [readMessages]);

  const handleClick = (event, messageId) => {
    setAnchorEls((prev) => ({ ...prev, [messageId]: event.currentTarget }));
  };

  const handleClose = (messageId) => {
    setAnchorEls((prev) => ({ ...prev, [messageId]: null }));
  };

  const handleChatMenuClick = (event) => {
    setChatMenuAnchorEl(event.currentTarget);
  };

  const handleChatMenuClose = () => {
    setChatMenuAnchorEl(null);
  };

  const handleClickDelete = (messageId) => {
    DELETE(`/api/messages/delete/${messageId}`)
      .then((res) => {
        const deletedMessage = res.data.data;
        setAllMessage((prevMessages) => {
          const currentChatMessages = prevMessages[currentChat?._id] || [];
          const updatedMessages = currentChatMessages.filter(
            (message) => message._id !== deletedMessage._id
          );
          return {
            ...prevMessages,
            [currentChat?._id]: updatedMessages,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const tempId = Date.now();

    const messageData = {
      text: newMessage,
      _id: tempId,
      pending: true,
      sender: {
        _id: loggedUser._id,
      },
      createdAt: dayjs().toISOString(),
    };

    setNewMessage("");
    setSending(true);

    setAllMessage((prev) => ({
      ...prev,
      [currentChat?._id]: [...(prev[currentChat?._id] || []), messageData],
    }));

    scrollToBottom();

    POST(`/api/messages/${currentChat?._id}`, { text: newMessage })
      .then((res) => {
        setAllMessage((prev) => ({
          ...prev,
          [currentChat?._id]: prev[currentChat?._id].map((msg) =>
            msg._id === tempId ? res.data.data : msg
          ),
        }));

        setChatList(
          produce((draft) => {
            const thisChat = draft[
              currentChat.isGroup ? "groupChats" : "chats"
            ].find((chat) => chat._id == currentChat._id);
            thisChat.lastMessage = res.data.data;
          })
        );
      })
      .catch((err) => {
        console.error("Error sending message:", err);

        setAllMessage((prev) => ({
          ...prev,
          [currentChat?._id]: prev[currentChat?._id].map((msg) =>
            msg._id === tempId ? { ...msg, error: true } : msg
          ),
        }));
      })
      .finally(() => {
        setSending(false);
        scrollToBottom();
      });
  };

  const name = currentChat.groupName
    ? currentChat.groupName
    : currentChat.participants?.find(
        (participant) => participant._id !== loggedUser._id
      ).name;
  useEffect(() => {
    if (!currentChat._id) return;
    const getMessage = () => {
      GET(`/api/messages/${currentChat?._id}`)
        .then((res) => {
          setAllMessage((prev) => ({
            ...prev,
            [currentChat?._id]: res.data.data,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getMessage();
  }, [currentChat, setAllMessage]);
  return currentChat ? (
    <>
      <UserProfileModal
        handleClose={() => setShowUserProfile(false)}
        open={showUserProfile}
        user={currentChat.participants?.find(
          (participant) => participant._id !== loggedUser._id
        )}
      />
      <Grid
        item
        xs={true}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#FAFAFA",
          padding: 0,
        }}
      >
        {}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            borderBottom: "1px solid #E8E8E8",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={
                currentChat.isGroup ? null : () => setShowUserProfile(true)
              }
            >
              <Avatar sx={{ bgcolor: `${stringToColor(name)}` }}>
                {getNameInitials(name)}
              </Avatar>
            </IconButton>
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {name}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setCurrentChat("")}>
              <Logout />
            </IconButton>
            <IconButton onClick={handleChatMenuClick}>
              <MoreVert />
            </IconButton>

            <ChatMenu
              anchorEl={chatMenuAnchorEl}
              handleClick={handleChatMenuClick}
              handleClose={handleChatMenuClose}
              showGroups={showGroups}
            />
          </Box>
        </Box>

        {}
        <Box
          sx={{
            flex: 1,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: mainColor,
              borderRadius: "10px",
            },
          }}
        >
          {allMessage?.[currentChat?._id]?.map((message, index, arr) => (
            <Box
              component={motion.div}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              key={message._id}
              ref={index === arr.length - 1 ? lastMessageRef : null}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender?._id === loggedUser?._id
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {message.sender?._id === loggedUser?._id && (
                  <IconButton
                    onClick={(event) => handleClick(event, message._id)}
                  >
                    <MoreVert style={{ cursor: "pointer" }} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={anchorEls[message._id]}
                  open={Boolean(anchorEls[message._id])}
                  onClose={() => handleClose(message._id)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClickDelete(message._id);
                      handleClose(message._id);
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
                <Paper
                  sx={{
                    padding: 1,
                    backgroundColor:
                      message.sender?._id === loggedUser?._id
                        ? mainColor
                        : "#E2E8F0",
                    color:
                      message.sender?._id === loggedUser?._id
                        ? "white"
                        : "#333333",
                    borderRadius: 2,
                    width: "fit-content",
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Paper>
              </Box>
              <Typography
                component="span"
                variant="caption"
                color="textSecondary"
              >
                {message.sender?._id === loggedUser?._id &&
                message.readBy?.length >= 2 ? (
                  <DoneAllIcon sx={{ marginRight: 1 }} />
                ) : (
                  ""
                )}
                {dayjs(message.createdAt).format("hh:mm A")}
              </Typography>
            </Box>
          ))}
          {typing?.find((item) => item.chatId === currentChat._id) && (
            <TypingIndicator typingRef={typingRef} />
          )}
        </Box>

        {}
        <MessageInput
          message={newMessage}
          setMessage={setNewMessage}
          onSend={handleSendMessage}
        />
      </Grid>
    </>
  ) : (
    <Grid
      item
      xs={true}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#FAFAFA",
        padding: 0,
      }}
    >
      <>
        <SmsFailedOutlinedIcon sx={{ color: "#505050" }} />
        <p style={{ color: "#505050" }}>No chat selected</p>
      </>
    </Grid>
  );
};

ChatRoom.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  allMessage: PropTypes.array,
  setAllMessage: PropTypes.func,
};

export default ChatRoom;
