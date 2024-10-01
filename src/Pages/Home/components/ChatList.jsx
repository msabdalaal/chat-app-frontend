import { useContext, useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  CircularProgress,
  Box,
  Paper,
  InputBase,
  Badge,
} from "@mui/material";
import PropTypes from "prop-types";
import ChatListModal from "./ChatListModal";
import { GET } from "../../../api/axios";
import { MainContext } from "../../../Contexts/MainContext";
import dayjs from "dayjs";
import { getNameInitials } from "../../../utils/helpers/getNameInitials";
import { stringToColor } from "../../../utils/helpers/getColorFromString";
import SearchIcon from "@mui/icons-material/Search";
import useListenTyping from "../../../hooks/useListenTyping";
import { SocketContext } from "../../../Contexts/SocketContext";

const ChatList = ({ showGroups, isMobile }) => {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  useListenTyping();
  const {
    chatList,
    setChatList,
    setCurrentChat,
    loading,
    setLoading,
    currentChat,
    loggedUser,
    mainColor,
    typing,
  } = useContext(MainContext);
  const { onlineUsers } = useContext(SocketContext);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const chatType = showGroups ? "groupChats" : "chats";

    if (chatList?.[chatType]?.length) return; // Don't fetch if chats already exist

    const getChatList = async () => {
      setLoading(true);
      await GET(
        `/api/${showGroups ? "groupChats" : "chats"}/${
          showGroups ? "userChats/all" : "userChats"
        }`
      )
        .then((response) => {
          setChatList((prev) => ({
            ...prev,
            [chatType]: response.data.data, // Update the specific chat type
          }));
        })
        .finally(() => setLoading(false));
    };

    getChatList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChatList, setLoading, showGroups]);

  // Filter the chats based on the search query
  const filteredChats = chatList?.[showGroups ? "groupChats" : "chats"]?.filter(
    (chat) => {
      const name = showGroups
        ? chat.groupName
        : chat.participants?.find(
            (participant) => participant._id !== loggedUser._id
          )?.name;
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
  );

  return (
    <Grid
      item
      xs={isMobile ? 12 : 3}
      sx={{
        padding: 2,
        height: "100%",
        backgroundColor: "#E8E8E8",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        component="form"
        sx={{
          p: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: "1rem",
          width: "100%",
        }}
      >
        <InputBase
          placeholder="Search"
          value={searchQuery} // Controlled input
          onChange={(e) => setSearchQuery(e.target.value)} // Update the searchQuery state
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            width: "100%",
          }}
        />
        <SearchIcon sx={{ color: "#d6d6d6" }} />
      </Paper>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80%" // Adjust if you want it to take the full height of the parent
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {showGroups ? "Groups" : "Chats"}
          </Typography>
          <List
            sx={{
              overflow: "auto",
              flex: 1,
              flexGrow: 1,
              "&::-webkit-scrollbar": {
                width: "5px", // Width of the scrollbar
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent", // Background of the scrollbar track
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: mainColor, // Scrollbar thumb color
                borderRadius: "10px", // Rounded corners for the thumb
              },
            }}
          >
            {Array.isArray(filteredChats) && filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const user = showGroups
                  ? chat.groupName
                  : chat.participants?.find(
                      (participant) => participant._id !== loggedUser._id
                    );
                return (
                  <ListItem
                    onClick={() => {
                      setCurrentChat(chat);
                    }}
                    sx={{
                      cursor: "pointer",
                      padding: "0 0.5rem",
                      ":hover": { backgroundColor: "#d6d6d6" },
                      bgcolor: `${currentChat._id == chat._id && "#d6d6d6"}`,
                    }}
                    key={chat._id}
                    disablePadding
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant={
                          onlineUsers.includes(user._id) ? "dot" : "standard"
                        }
                        sx={{
                          "& .MuiBadge-dot": {
                            backgroundColor: mainColor, // Set the color for online indicator
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            border: "2px solid white", // Border to match the avatar's edge
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: `${stringToColor(user.name)}`,
                          }}
                        >
                          {getNameInitials(user.name)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body1"
                            sx={{
                              marginRight: "8px",
                              fontSize: 18,
                              textTransform: "capitalize",
                            }}
                          >
                            {user.name}
                          </Typography>
                          {/* Unread message indicator */}
                          {chat.lastMessage?.readBy &&
                            !chat.lastMessage.readBy.includes(
                              loggedUser._id
                            ) && (
                              <Box
                                sx={{
                                  width: "10px",
                                  height: "10px",
                                  backgroundColor: mainColor, // Red color for unread message
                                  borderRadius: "50%",
                                  marginLeft: "4px",
                                }}
                              ></Box>
                            )}
                        </Box>
                      }
                      secondary={
                        <Typography
                          sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "100px", // Adjust the max width as needed
                            fontSize: 14,
                          }}
                          color="textSecondary"
                        >
                          {typing?.find((item) => item.chatId == chat._id) ? (
                            <Typography
                              sx={{
                                color: mainColor,
                                fontStyle: "italic", // Italicize the "Typing..." text
                                display: "inline-flex", // Allow for animated dots
                                alignItems: "center",
                                fontSize: 14,
                              }}
                            >
                              Typing
                              <Box
                                sx={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  backgroundColor: mainColor,
                                  animation: "dot-flash 1s infinite",
                                  marginLeft: "4px",
                                  "&:nth-of-type(2)": {
                                    animationDelay: "0.2s",
                                  },
                                  "&:nth-of-type(3)": {
                                    animationDelay: "0.4s",
                                  },
                                }}
                              />
                              <Box
                                sx={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  backgroundColor: mainColor,
                                  animation: "dot-flash 1s infinite",
                                  marginLeft: "4px",
                                }}
                              />
                              <Box
                                sx={{
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  backgroundColor: mainColor,
                                  animation: "dot-flash 1s infinite",
                                  marginLeft: "4px",
                                }}
                              />
                            </Typography>
                          ) : (
                            chat.lastMessage?.text ?? "No messages yet"
                          )}
                        </Typography>
                      }
                    />
                    <Typography variant="body2" color="textSecondary">
                      {chat.lastMessage
                        ? dayjs(chat.lastMessage?.createdAt).format("hh:mm A")
                        : ""}
                    </Typography>
                  </ListItem>
                );
              })
            ) : (
              <p>No chats found</p>
            )}
          </List>
        </>
      )}

      <Button
        variant="contained"
        sx={{
          width: "50px", // Ensure width and height are equal
          height: "50px",
          minWidth: "50px",
          minHeight: "50px",
          borderRadius: "50%", // Ensures it's round
          backgroundColor: mainColor,
          display: "flex", // Center the icon inside
          justifyContent: "center", // Horizontally center the icon
          alignItems: "center", // Vertically center the icon
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.2)", // Floating shadow effect
          ":hover": {
            color: "black",
            backgroundColor: "#E8E8E8",
            boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow on hover
          },
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
        }}
        onClick={handleOpenModal}
      >
        <Add />
      </Button>

      <ChatListModal
        open={openModal}
        handleClose={handleCloseModal}
        showGroups={showGroups}
      />
    </Grid>
  );
};

// Adding propTypes validation
ChatList.propTypes = {
  showGroups: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default ChatList;
