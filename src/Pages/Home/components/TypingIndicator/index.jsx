import { Box, Paper, Typography } from "@mui/material";
import "./typing-indicator.css";
import { motion } from "framer-motion";
// eslint-disable-next-line react/prop-types
const TypingIndicator = ({ typingRef }) => {
  return (
    <Box
      component={motion.div}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      ref={typingRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Align with incoming message layout
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Paper
          sx={{
            paddingY: 2,
            paddingX: 1,
            backgroundColor: "#E2E8F0", // Same background as incoming messages
            borderRadius: 2,
            width: "fit-content",
          }}
        >
          {/* Typing dots with animation */}
          <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                backgroundColor: "#333333",
                borderRadius: "50%",
                animation: "bounce 1.5s infinite ease-in-out",
                animationDelay: "0s",
              }}
            ></Box>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                backgroundColor: "#333333",
                borderRadius: "50%",
                animation: "bounce 1.5s infinite ease-in-out",
                animationDelay: "0.3s",
              }}
            ></Box>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                backgroundColor: "#333333",
                borderRadius: "50%",
                animation: "bounce 1.5s infinite ease-in-out",
                animationDelay: "0.6s",
              }}
            ></Box>
          </Box>
        </Paper>
      </Box>
      <Typography variant="caption" color="textSecondary">
        typing...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;
