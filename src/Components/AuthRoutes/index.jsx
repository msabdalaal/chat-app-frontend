import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../Contexts/MainContext";

const AuthRoutes = () => {
  const { logged } = useContext(MainContext);
  return logged ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRoutes;
