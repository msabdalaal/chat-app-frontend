import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import AuthRoutes from "./Components/AuthRoutes";

function App() {
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const userAgent = navigator.userAgent.toLowerCase();
  //   const mobileDevices =
  //     /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/;
  //   const isMobileDevice = mobileDevices.test(userAgent);

  //   if (isMobileDevice || window.innerWidth <= 768) {
  //     setIsMobile(true);
  //   }
  // }, []);

  if (
    Notification.permission === "default" ||
    Notification.permission === "denied"
  ) {
    Notification.requestPermission();
  }

  // if (isMobile) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
  //       <div className="text-center p-5 rounded bg-white">
  //         <i className="fas fa-desktop display-1 text-primary mb-4"></i>
  //         <h1 className="display-5 fw-bold mb-3 text-secondary">
  //           Please use a computer
  //         </h1>
  //         <p className="lead text-muted">
  //           This application works best on a desktop or laptop. Switch to a
  //           larger screen for the best experience!
  //         </p>
  //         <a href="/" className="btn btn-primary mt-4">
  //           Refresh
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
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
