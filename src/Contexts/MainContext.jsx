import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { GET, POST } from "../api/axios";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export let MainContext = createContext("");

export function MainContextProvider({ children }) {
  const [mainColor, setMainColor] = useState("#3A506B");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [currentChat, setCurrentChat] = useState("");
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [allMessage, setAllMessage] = useState({});
  const [typing, setTyping] = useState([]);
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const socket = useRef(null);
  function logOut() {
    POST("/api/users/logout", {}).finally(() => {
      setLoggedUser(null);
    });
  }
  useEffect(() => {
    if (!isMobile) {
      setIsChatListCollapsed(false);
    }
  }, [isMobile]);
  useEffect(() => {
    setLoading(true);
    GET("/api/users/profile")
      .then((res) => {
        if (res.data.success) {
          setLoggedUser(res.data.data);
        }
      })
      .catch(() => {
        setLoggedUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    const mainColorFromLS = localStorage.getItem("mainColor");
    if (mainColorFromLS) {
      setMainColor(mainColorFromLS);
    }
  }, []);

  const handleChangeMainColor = (value) => {
    setMainColor(value);
    localStorage.setItem("mainColor", value);
  };

  return (
    <MainContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        setLoading,
        loading,
        sending,
        setSending,
        logOut,
        chatList,
        setChatList,
        currentChat,
        setCurrentChat,
        allMessage,
        setAllMessage,
        friendsInfo,
        setFriendsInfo,
        socket,
        mainColor,
        handleChangeMainColor,
        typing,
        setTyping,
        isChatListCollapsed,
        setIsChatListCollapsed,
        isMobile,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

MainContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
