// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MainContextProvider } from "./Contexts/MainContext.jsx";
import { SocketProvider } from "./Contexts/SocketContext.jsx";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <MainContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </MainContextProvider>
  </BrowserRouter>
  // </StrictMode>
);
