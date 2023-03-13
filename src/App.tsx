import { useEffect, useRef } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Menu from "./component/Menu";
import DNSPage from "./route/DNSPage";
import LoginPage from "./route/LoginPage";
import MainPage from "./route/MainPage";
import Page404 from "./route/Page404";
import UserPage from "./route/UserPage";
import VPNPage from "./route/VPNPage";
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
          <Route path="/vpn" element={<VPNPage />} />
          <Route path="/dns" element={<DNSPage />}></Route>
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </div>
      <Footer></Footer>
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
  }, [client.authStore, location.pathname, navigate, client.users]);

  return null;
}

export default App;
