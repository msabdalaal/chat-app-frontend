import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../Contexts/MainContext";

const ProtectedRoutes = () => {
  const { logged } = useContext(MainContext);
  return logged ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
