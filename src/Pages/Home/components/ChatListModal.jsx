import {
  Modal,
  IconButton,
  Typography,
  Button,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { GET, POST } from "../../../api/axios";
import { MainContext } from "../../../Contexts/MainContext";
import { produce } from "immer";

const ChatListModal = ({ open, handleClose, showGroups }) => {
  const [email, setEmail] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const { setChatList,mainColor } = useContext(MainContext);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (query) {
      const debounceTimeout = setTimeout(() => {
        fetchSuggestions(query);
      }, 1000);
      return () => clearTimeout(debounceTimeout);
    }
  }, [query]);

  // Reset selected emails when changing between tabs or opening a new one
  useEffect(() => {
    setSelectedEmails([]);
  }, [showGroups]);

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

  const handleSelect = (event, value) => {
    const emails = Array.isArray(value) ? value : [value];
    setSelectedEmails(emails);
  };

  const handleCreateGroup = async () => {
    if (showGroups && !groupName) return alert("Please add a group name");
    if (selectedEmails.length === 0)
      return alert("Please add member to chat with");

    const selectedIds = selectedEmails.map((email) => email._id);
    const payload = {
      groupName,
      participants: selectedIds,
    };

    setLoading(true);
    await POST(`/api/${showGroups ? "groupChats" : "chats"}/create`, payload)
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setChatList(
            produce((value) => {
              const chatList = value[showGroups ? "groupChats" : "chats"];
              if (chatList) {
                chatList.push(response.data.data);
              }
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          color: "white",
          backgroundColor: mainColor,
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          maxWidth: "500px",
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

        <Typography variant="h4" id="modal-title" sx={{ margin: "30px" }}>
          {showGroups ? "Create New Group" : "Add Friends By Email"}
        </Typography>

        {showGroups ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              label="Enter Group Name"
              variant="outlined"
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  "&.Mui-focused fieldset": { borderColor: "#222" },
                },
                "& .MuiInputLabel-root": { color: "#222" },
              }}
            />
            <Autocomplete
              multiple
              disablePortal
              options={email}
              getOptionLabel={(option) => option.email}
              loading={loading}
              onChange={handleSelect}
              sx={{
                width: "100%",
                mt: 1,
                "& .MuiAutocomplete-endAdornment": { display: "none" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Members"
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
                    mt: 2,
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              color="inherit"
              disabled={loading}
              sx={{
                mt: 4,
                alignSelf: "center",
              }}
              onClick={handleCreateGroup}
            >
              {loading ? "Creating" : "Create Group"}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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

            <Button
              variant="contained"
              color="inherit"
              disabled={loading}
              onClick={handleCreateGroup}
              sx={{
                mt: 2,
                alignSelf: "center",
              }}
            >
              {loading ? "Adding" : "Create Chat"}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// Adding propTypes validation
ChatListModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  showGroups: PropTypes.bool.isRequired,
};

export default ChatListModal;
