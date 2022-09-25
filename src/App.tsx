import { useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Header from "./component/Header";
import Menu from "./component/Menu";
import LoginPage from "./route/LoginPage";
import MainPage from "./route/MainPage";
import Page404 from "./route/Page404";
import UserPage from "./route/UserPage";
import { useAuthStore } from "./store/authStore";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ display: "flex" }}>
        <Menu />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </div>
      <LoginContext />
    </BrowserRouter>
  );
}

function LoginContext() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestRef = useRef(false);
  const { client } = useAuthStore((store) => store);

  useEffect(() => {
    if (requestRef.current === true) {
      return;
    }
    requestRef.current = true;
    (async () => {
      try {
        await client.users.refresh();
        if (location.pathname === "/") {
          navigate("/main");
        }
      } catch (e) {
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
      requestRef.current = false;
    })();
  }, [client.authStore]);

  return null;
}

export default App;
