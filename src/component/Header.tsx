import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import DGISTLONGPNG from "../asset/DGISTLONG.png";
import { useAuthStore } from "../store/authStore";
import { NoSelect } from "../style";

const Wrap = styled.div`
  height: 60px;
  background-color: #231f20;
  display: flex;
  align-items: center;
  ${NoSelect}
`;

const Cont = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 28px;
`;

const Logout = styled.div`
  color: white;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Haeder() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestRef = useRef(false);
  const { client } = useAuthStore((store) => store);

  if (location.pathname === "/") {
    return <></>;
  }

  return (
    <Wrap>
      <Cont>
        <Logo src={DGISTLONGPNG} />
        <div style={{ flex: 1 }}></div>
        <Logout
          onClick={async () => {
            if (requestRef.current === true) {
              return;
            }
            await client.authStore.clear();
            navigate("/");
            requestRef.current = false;
          }}
        >
          Logout
        </Logout>
      </Cont>
    </Wrap>
  );
}
