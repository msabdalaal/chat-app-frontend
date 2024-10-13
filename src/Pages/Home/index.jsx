import { useContext, useState } from "react";
import { Grid, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./components/Sidebar";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import { MainContext } from "../../Contexts/MainContext";

const ChatApp = () => {
  const [showGroups, setShowGroups] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mainColor } = useContext(MainContext);
  return (
    // Parent container that takes up full viewport height and centers the content
    <Box
      sx={{
        height: "100vh", // Full viewport height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA", // Background color for the full screen
      }}
    >
      <Box
        sx={{
          height: "90vh", // 90% of the viewport height for the chat box
          width: "100%",
          backgroundColor: "#FAFAFA",
          display: "flex",
          justifyContent: "center", // Center horizontally inside chat box
          alignItems: "center", // Center vertically inside chat box
          border: `1px solid ${mainColor}`, // Add a light border
          borderRadius: "8px", // Rounded corners
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Nice shadow effect
          overflow: "hidden", //
        }}
      >
        <Grid
          container
          sx={{
            height: "100%",
            width: "100%",
            margin: 0,
            position: "relative",
          }}
        >
          <Sidebar
            showGroups={showGroups}
            isMobile={isMobile}
            setShowGroups={setShowGroups}
          />

          {/* Groups or Friends List */}
          <ChatList showGroups={showGroups} isMobile={isMobile} />

          {/* Chat Room */}
          <ChatRoom showGroups={showGroups} isMobile={isMobile} />
        </Grid>
      </Box>
    </Box>
  );
};

export default ChatApp;
