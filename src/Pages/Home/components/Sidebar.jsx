import {
  Avatar,
  IconButton,
  Button,
  Grid,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { MainContext } from "../../../Contexts/MainContext";
import { stringToColor } from "../../../utils/helpers/getColorFromString";
import { getNameInitials } from "../../../utils/helpers/getNameInitials";
import UserProfileModal from "./UserProfileModal";
import { MuiColorInput } from "mui-color-input";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
const Sidebar = ({ showGroups, setShowGroups }) => {
  const { setLogged, loggedUser, mainColor, handleChangeMainColor } =
    useContext(MainContext);
  const [openSettings, setOpenSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  return (
    <>
      <UserProfileModal
        handleClose={() => setShowUserProfile(false)}
        open={showUserProfile}
        user={loggedUser}
      />
      <Grid
        item
        xs={1}
        sx={{
          backgroundColor: mainColor,
          color: "white",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <IconButton onClick={() => setShowUserProfile(true)}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              marginBottom: 4,
              marginTop: 2,
              bgcolor: `${stringToColor(loggedUser.name)}`,
            }}
          >
            {getNameInitials(loggedUser.name)}
          </Avatar>
        </IconButton>

        <IconButton
          sx={
            showGroups
              ? { color: "white" }
              : { color: "black", backgroundColor: "white" }
          }
          onClick={() => setShowGroups(false)}
        >
          <ChatIcon
            sx={showGroups ? { color: "white" } : { color: mainColor }}
          />
        </IconButton>
        <IconButton
          sx={
            showGroups
              ? { color: "black", backgroundColor: "white" }
              : { color: "white" }
          }
          onClick={() => setShowGroups(true)}
        >
          <GroupsIcon
            sx={showGroups ? { color: mainColor } : { color: "white" }}
          />
        </IconButton>

        <IconButton onClick={() => setOpenSettings(true)}>
          <Settings sx={{ color: "white" }} />
        </IconButton>
        <Menu open={openSettings} onClose={() => setOpenSettings(false)}>
          <MenuItem>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <span>
                {" "}
                <MuiColorInput
                  value={mainColor}
                  onChange={handleChangeMainColor}
                  onReset={() => handleChangeMainColor("#3A506B")}
                />
              </span>
              <IconButton
                sx={{ width: "30px", height: "30px" }}
                onClick={() => handleChangeMainColor("#3A506B")}
              >
                <RestartAltIcon />
              </IconButton>
            </Box>
          </MenuItem>
        </Menu>
        <Button
          sx={{ marginTop: "auto", color: "white" }}
          onClick={() => {
            setLogged(false);
          }}
          startIcon={<Logout />}
        >
          Logout
        </Button>
      </Grid>
    </>
  );
};

// Adding propTypes validation
Sidebar.propTypes = {
  showGroups: PropTypes.bool.isRequired, // showGroups is required and must be a boolean
  setShowGroups: PropTypes.func.isRequired, // setShowGroups is required and must be a function
};

export default Sidebar;
