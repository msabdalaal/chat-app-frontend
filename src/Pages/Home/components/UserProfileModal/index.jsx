/* eslint-disable react/prop-types */
import { Modal, Box, Typography, IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getNameInitials } from "../../../../utils/helpers/getNameInitials";
import { stringToColor } from "../../../../utils/helpers/getColorFromString";
import { useContext } from "react";
import { MainContext } from "../../../../Contexts/MainContext";

const UserProfileModal = ({ open, handleClose, user }) => {
  const { mainColor } = useContext(MainContext);
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
          maxWidth: "400px",
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

        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: "20px auto",
            bgcolor: `${stringToColor(user.name)}`,
          }}
        >
          {getNameInitials(user.name)}
        </Avatar>

        <Typography variant="h5" id="modal-title" sx={{ margin: "10px 0" }}>
          {user.name}
        </Typography>

        <Typography
          variant="body1"
          id="modal-description"
          sx={{ marginBottom: "20px" }}
        >
          {user.email}
        </Typography>
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
