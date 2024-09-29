import { createContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { POST } from "../api/axios";

export let MainContext = createContext("");

export function MainContextProvider({ children }) {
  const [mainColor, setMainColor] = useState("#3A506B");
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [currentChat, setCurrentChat] = useState("");
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [allMessage, setAllMessage] = useState({});
  const socket = useRef(null);
  function logOut() {
    POST("/api/users/logout", {}).finally(() => {
      setLoggedUser({});
      setLogged(false);
    });
  }
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
        logged,
        loggedUser,
        setLoggedUser,
        setLoading,
        loading,
        sending,
        setSending,
        setLogged,
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
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

MainContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
