import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../Contexts/MainContext";

const AuthRoutes = () => {
  const { loggedUser } = useContext(MainContext);
  return loggedUser ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRoutes;
