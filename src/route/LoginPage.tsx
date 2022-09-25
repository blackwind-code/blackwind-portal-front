import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DGISTPNG from "../asset/DGIST.png";
import LoginBackground from "../asset/LoginBackground.jpg";
import { useAuthStore } from "../store/authStore";
import { NoSelect } from "../style";

const Wrap = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${NoSelect}
`;

const Background = styled.div`
  z-index: -1;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: url(${LoginBackground});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(2px) brightness(80%);
`;

const Cont = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;
  width: 100vw;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 5px 15px;
  background-color: white;
  padding: 50px 25px;
  border-radius: 12px;
`;
const LogoWrap = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 180px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #231f20;
`;

const Logo = styled.img`
  height: 70%;
`;

const LoginCont = styled.div`
  margin-top: 80px;
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.div`
  color: #000;
`;

const Input = styled.input`
  width: 220px;
  height: 24px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  &:focus {
    outline-color: #3d62a4;
  }
`;

const LoginButton = styled.div`
  width: 100%;
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

const Link = styled.span`
  width: fit-content;
  align-self: center;
  cursor: pointer;
  text-align: right;
  &:hover {
    text-decoration: underline;
  }
`;

export default function LoginPage() {
  const client = useAuthStore((store) => store.client);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <Wrap>
      <Background></Background>
      <Cont>
        <LogoWrap>
          <Logo src={DGISTPNG} draggable={false}></Logo>
        </LogoWrap>
        <LoginCont>
          <Title>Email :</Title>
          <Input
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Title>Password :</Title>
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Link>Forgot password?</Link>{/**TODO: forgot password */}
          <LoginButton
            style={{ marginTop: 12 }}
            onClick={async () => {
              try {
                await client.users.authViaEmail(email, password);
                navigate("/main");
              } catch (e) {
                console.log(e);
                alert("이메일과 비밀번호가 맞지 않습니다.");
              }
            }}
          >
            <span>Sign In</span>
          </LoginButton>
        </LoginCont>
        <Link style={{ marginTop: 36 }}>Sign Up</Link>{/**TODO: sign up */}
      </Cont>
    </Wrap>
  );
}
