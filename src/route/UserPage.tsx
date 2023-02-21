import { ClientResponseError } from "pocketbase";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BaseButton from "../component/BaseButton";
import { useAuthStore } from "../store/authStore";
import { NoSelect } from "../style";
import { alertError } from "../util/error";
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

const Button = styled(BaseButton)`
  width: 240px;
  background-color: #3d62a4;
  color: white;
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
        setEmail(res.email);
      } catch (e: any) {
        alertError(e as ClientResponseError);
      }
      requesting.current = true;
    })();
  }, [client.users, client.authStore.token, email.length]);

  return (
    <Cont>
      <LoginCont>
        <Title>Email :</Title>
        {email}
        <Button
          onClick={async () => {
            try {
              await client.users.requestPasswordReset(email);
              alert(`${email}의 메일함을 확인해주세요`);
              await client.authStore.clear();
              navigate("/");
            } catch (e: any) {
              alertError(e as ClientResponseError);
            }
          }}
        >
          비밀변경
        </Button>
      </LoginCont>
    </Cont>
  );
}
