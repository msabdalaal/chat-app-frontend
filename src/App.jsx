import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
// import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import AuthRoutes from "./Components/AuthRoutes";

function App() {
  localStorage.clear;
  return (
    <div>
      {/* <Navbar logOut={logOut} /> */}
      <div className="container">
        <Routes>
          <Route element={<AuthRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="*" element={<h1>Not Found!</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
