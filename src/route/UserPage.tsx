import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthStore } from "../store/authStore";
import { NoSelect } from "../style";
import { getIdByToken } from "../util/token";

const Cont = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const LoginCont = styled.div`
  margin-top: 80px;
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.div`
  color: #000;
  ${NoSelect}
`;

const Back = styled.a`
  margin-top: 30px;
  font-size: 16px;
  color: black;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const Button = styled.div`
  width: 240px;
  background-color: #3d62a4;
  color: white;
  border-radius: 5px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
`;

export default function UserPage() {
  const navigate = useNavigate();
  const client = useAuthStore((store) => store.client);
  const requesting = useRef(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (requesting.current) {
      return;
    }
    if (email.length > 0) {
      return;
    }
    requesting.current = true;
    (async () => {
      try {
        const res = await client.users.getOne(
          getIdByToken(client.authStore.token)
        );
        console.log(res);
        setEmail(res.email);
      } catch {}
      requesting.current = true;
    })();
  }, [client.authStore.token]);

  return (
    <Cont>
      <LoginCont>
        <Title>Email :</Title>
        {email}
        <Button
          onClick={async () => {
            try {
              const userAuthData1 = await client.users.requestPasswordReset(
                email
              );
              alert(`${email}을 확인하세요.`);
              await client.authStore.clear();
              navigate("/");
            } catch (e) {}
          }}
        >
          비밀변경
        </Button>
      </LoginCont>
    </Cont>
  );
}
