import {
  Modal,
  IconButton,
  Typography,
  Button,
  Box,
  TextField,
  Autocomplete,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { Close as CloseIcon, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../Contexts/MainContext";
import { DELETE, GET, POST } from "../../../api/axios";
import { produce } from "immer";
import { stringToColor } from "../../../utils/helpers/getColorFromString";
import { getNameInitials } from "../../../utils/helpers/getNameInitials";

const actionDetails = {
  clear: {
    title: "Are You Sure You Want To Clear The Chat?",
    message: "All messages will be deleted for all the users",
    showEmail: false,
  },
  delete: {
    title: "Are You Sure You Want To Delete This Chat?",
    message: "The chat will be deleted entirely",
    showEmail: false,
  },
  block: {
    title: "Are You Sure You Want To Block This User?",
    message: "Blocked users cannot call or send you messages",
    showEmail: false,
  },
  add: { title: "Add Member", message: "", showEmail: true },
  view: { title: "Group Members", message: "", showEmail: false },
  exit: {
    title: "Are You Sure You Want To Exit This Group?",
    message:
      "You will not be able to send or receive any messages on this group",
    showEmail: false,
  },
};

const ChatMenuModal = ({ open, handleClose, actionType }) => {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState([]);

  const {
    loading,
    setLoading,
    setChatList,
    currentChat,
    setCurrentChat,
    loggedUser,
    setAllMessage,
    mainColor
  } = useContext(MainContext);
  const { title, message, showEmail } = actionDetails[actionType];

  const handleAddMember = async () => {
    if (selectedEmail.length === 0)
      return alert("Please add member to chat with");

    const payload = {
      userId: selectedEmail._id,
    };

    setLoading(true);
    await POST(`/api/groupChats/add/${currentChat._id}`, payload)
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setChatList(
            produce((draft) => {
              const thisChatIndex = draft.groupChats.findIndex(
                (chat) => chat._id === currentChat._id
              );
              if (thisChatIndex !== -1) {
                draft.groupChats[thisChatIndex] = response.data.data; // Update the found chat directly
              }
            })
          );
          setCurrentChat(response.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelect = (_, value) => {
    setSelectedEmail(value);
  };
  useEffect(() => {
    async function fetchSuggestions(searchQuery) {
      setLoading(true);
      await GET(`/api/users/search/${searchQuery}`)
        .then((response) => {
          if (response.data.success) {
            setEmail(response.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    if (query) {
      const debounceTimeout = setTimeout(() => {
        fetchSuggestions(query);
      }, 1000);
      return () => clearTimeout(debounceTimeout);
    }
  }, [query, setLoading]);

  // Reset selected emails when changing between tabs or opening a new one
  useEffect(() => {
    setSelectedEmail([]);
  }, []);

  const handleConfirm = () => {
    if (actionType == "add") {
      handleAddMember();
    }
    if (actionType == "exit") {
      handleRemoveUser(loggedUser._id);
    }
    if (actionType == "clear") {
      handleClearChat();
    }
    if (actionType == "delete") {
      handleDeleteChat();
    }
  };
  const handleDeleteChat = async () => {
    setLoading(true);
    await DELETE(`/api/chats/delete/${currentChat._id}`)
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setChatList(
            produce((draft) => {
              const thisChatIndex = draft.chats.findIndex(
                (chat) => chat._id === currentChat._id
              );
              if (thisChatIndex !== -1) {
                draft.chats.splice(thisChatIndex, 1);
              }
            })
          );
          setCurrentChat(""); // Clear current chat if the current user was removed
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleClearChat = async () => {
    setLoading(true);
    await DELETE(`/api/messages/deleteAll/${currentChat._id}`)
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setAllMessage(
            produce((draft) => {
              draft[currentChat._id] = []; // Clear all messages in the current chat
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRemoveUser = async (userId) => {
    setLoading(true);
    await DELETE(`/api/groupChats/deleteUser/${currentChat._id}`, { userId })
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setChatList(
            produce((draft) => {
              const thisChatIndex = draft.groupChats.findIndex(
                (chat) => chat._id === currentChat._id
              );
              if (thisChatIndex !== -1) {
                if (userId === loggedUser._id) {
                  // If the user removed is the current user, remove the chat from the list
                  draft.groupChats.splice(thisChatIndex, 1);
                } else {
                  // Otherwise, update the chat
                  draft.groupChats[thisChatIndex] = response.data.data;
                }
              }
            })
          );
          if (userId !== loggedUser._id) {
            setCurrentChat(response.data.data);
          } else {
            setCurrentChat(""); // Clear current chat if the current user was removed
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          color: "white",
          backgroundColor: mainColor,
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          minWidth: "400px",
          margin: "auto",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" sx={{ margin: "20px" }}>
          {title}
        </Typography>
        {message && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}
        {actionType == "view" && (
          <List>
            {Array.isArray(currentChat.participants) &&
            currentChat.participants.length > 0 ? (
              currentChat.participants.map((user) => {
                const name = user.name;
                return (
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      padding: "0 0.5rem",
                    }}
                    key={user._id}
                    disablePadding
                    secondaryAction={
                      user._id != loggedUser._id &&
                      currentChat.admin == loggedUser._id && (
                        <IconButton
                          edge="end"
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={() => handleRemoveUser(user._id)}
                        >
                          <Delete sx={{ color: "white" }} />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${stringToColor(name)}`,
                        }}
                      >
                        {getNameInitials(name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      secondaryTypographyProps={{ color: "#d6d6d6" }}
                      primary={name}
                      secondary={user.email}
                    />

                    {/* Menu for more options */}
                  </ListItem>
                );
              })
            ) : (
              <p>No chats found</p>
            )}
          </List>
        )}
        {showEmail && (
          <Autocomplete
            disablePortal
            options={email}
            onChange={handleSelect}
            getOptionLabel={(option) => option.email}
            loading={loading}
            sx={{
              width: "100%",
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter Email"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  style: { paddingRight: 0 },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "&.Mui-focused fieldset": { borderColor: "#222" },
                  },
                  "& .MuiInputLabel-root": { color: "#222" },
                }}
              />
            )}
          />
        )}
        {showEmail ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              disabled={loading}
              variant="contained"
              color="inherit"
              onClick={handleConfirm}
            >
              {loading ? "Loading" : "Add"}
            </Button>
          </Box>
        ) : actionType == "view" ? null : (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="inherit" onClick={handleConfirm}>
              Yes, Confirm
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// PropTypes validation
ChatMenuModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  actionType: PropTypes.oneOf(["add", "clear", "block", "exit"]).isRequired,
};

export default ChatMenuModal;
