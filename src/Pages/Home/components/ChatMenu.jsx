import { Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import ChatMenuModal from "./ChatMenuModal";
import UserProfileModal from "./UserProfileModal";
import { MainContext } from "../../../Contexts/MainContext";

const ChatMenu = ({ anchorEl, handleClose, showGroups }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [actionType, setActionType] = useState("add");
  const { currentChat, loggedUser } = useContext(MainContext);
  const handleMenuItemClick = (action) => {
    setActionType(action);
    setModalOpen(true);
    handleClose();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {currentChat.isGroup
          ? [
              <MenuItem key="view" onClick={() => handleMenuItemClick("view")}>
                View Users
              </MenuItem>,
              <MenuItem key="add" onClick={() => handleMenuItemClick("add")}>
                Add Member
              </MenuItem>,
              currentChat.admin == loggedUser._id && (
                <MenuItem
                  key="clear"
                  onClick={() => handleMenuItemClick("clear")}
                >
                  Clear Chat
                </MenuItem>
              ),
              <MenuItem key="exit" onClick={() => handleMenuItemClick("exit")}>
                Exit Group
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="view-profile"
                onClick={() => setUserProfileModal(true)}
              >
                View Profile
              </MenuItem>,
              <MenuItem
                key="clear"
                onClick={() => handleMenuItemClick("clear")}
              >
                Clear Chat
              </MenuItem>,
              <MenuItem
                key="delete"
                onClick={() => handleMenuItemClick("delete")}
              >
                Delete Chat
              </MenuItem>,
            ]}
      </Menu>
      <UserProfileModal
        open={userProfileModal}
        handleClose={() => setUserProfileModal(false)}
        user={currentChat.participants.find(
          (user) => user._id != loggedUser._id
        )}
      />
      <ChatMenuModal
        open={modalOpen}
        handleClose={handleModalClose}
        showGroups={showGroups}
        actionType={actionType}
      />
    </>
  );
};

ChatMenu.propTypes = {
  showGroups: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

export default ChatMenu;
