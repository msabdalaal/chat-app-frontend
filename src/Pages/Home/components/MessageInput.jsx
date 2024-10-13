import { useEffect, useContext, useRef } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import PropTypes from "prop-types";
import { MainContext } from "../../../Contexts/MainContext";
import { SocketContext } from "../../../Contexts/SocketContext";

const MessageInput = ({ message, setMessage, onSend }) => {
  const { sending, mainColor, currentChat } = useContext(MainContext);
  const { socket } = useContext(SocketContext);

  const typingTimeoutRef = useRef(null); // Reference to the typing timeout

  const handleTyping = () => {
    // Clear the previous timeout if the user types again before it finishes
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit the typing event
    socket.emit("typing", { currentChat });

    // Set a timeout to emit the stopTyping event after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { currentChat });
    }, 2000); // 2-second delay
  };

  useEffect(() => {
    return () => {
      // Clear the timeout on unmount to prevent memory leaks
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit("stopTyping", { currentChat }); // Ensure to stop typing on unmount
    };
  }, [socket, currentChat]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSend();
      socket.emit("stopTyping", { currentChat });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        borderTop: "1px solid #E8E8E8",
        backgroundColor: "white",
      }}
    >
      <TextField
        placeholder="Type your message here..."
        variant="outlined"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping(); // Trigger typing when the user types in the input field
        }}
        onKeyPress={!sending ? handleKeyPress : null}
        sx={{ backgroundColor: "#f3f4f6", borderRadius: 0, width: "100%" }}
      />
      <IconButton onClick={!sending ? onSend : null}>
        <Send sx={{ color: mainColor }} />
      </IconButton>
    </Box>
  );
};

MessageInput.propTypes = {
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default MessageInput;
