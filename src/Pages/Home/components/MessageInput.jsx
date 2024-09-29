import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { useContext } from "react";
import { MainContext } from "../../../Contexts/MainContext";

const MessageInput = ({ message, setMessage, onSend }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSend();
    }
  };
  const { sending,mainColor } = useContext(MainContext);
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
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={!sending ? handleKeyPress : null} // Add the onKeyPress handler
        sx={{ backgroundColor: "#f3f4f6", borderRadius: 0, width: "100%" }}
      />
      <IconButton onClick={!sending ? onSend : null} disabled={!message.trim()}>
        <Send sx={{ color: mainColor }} />
      </IconButton>
    </Box>
  );
};

MessageInput.propTypes = {
  message: PropTypes.string.isRequired, // Ensure message is a required string
  setMessage: PropTypes.func.isRequired, // Ensure setMessage is a required function
  onSend: PropTypes.func.isRequired, // Ensure onSend is a required function
};

export default MessageInput;
