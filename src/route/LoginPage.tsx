import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DGISTPNG from "../asset/DGIST.png";
import LoginBackground from "../asset/LoginBackground.jpg";
import { useAuthStore } from "../store/authStore";
import { NoSelect } from "../style";
import { alertError } from "../util/error";

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
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Wrap>
      <Background></Background>
      <Cont>
        <LogoWrap>
          <Logo src={DGISTPNG} draggable={false}></Logo>
        </LogoWrap>
        {isSignUp ? <SignUp /> : <SignIn />}
        {!isSignUp && (
          <Link onClick={() => setIsSignUp(true)} style={{ marginTop: 36 }}>
            Sign Up
          </Link>
        )}
        {/**TODO: sign up */}
      </Cont>
    </Wrap>
  );
}
function SignIn() {
  const client = useAuthStore((store) => store.client);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <LoginCont>
      <Title>Email :</Title>
      <Input
        placeholder="email"
        value={email ?? ""}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Title>Password :</Title>
      <Input
        type="password"
        value={password ?? ""}
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Link
        onClick={async () => {
          try {
            await client.users.requestPasswordReset(email);
            alert(`${email}??? ???????????????.`);
          } catch (e) {
            alertError(e as ClientResponseError);
          }
        }}
      >
        Forgot password?
      </Link>
      <LoginButton
        style={{ marginTop: 12 }}
        onClick={async () => {
          try {
            const res = await client.users.authViaEmail(email, password);
            console.log(res);

            navigate("/main");
          } catch (e: any) {
            alertError(e as ClientResponseError);
          }
        }}
      >
        <span>Sign In</span>
      </LoginButton>
    </LoginCont>
  );
}

function SignUp() {
  const client = useAuthStore((store) => store.client);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const navigate = useNavigate();
  return (
    <LoginCont>
      <Title>Email :</Title>
      <Input
        placeholder="email"
        value={email ?? ""}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Title>Password :</Title>
      <Input
        type="password"
        placeholder="password"
        value={password ?? ""}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Title>Password Confirm:</Title>
      <Input
        type="password"
        placeholder="password confirm"
        value={passwordConfirm ?? ""}
        onChange={(e) => {
          setPasswordConfirm(e.target.value);
        }}
      />
      <LoginButton
        style={{ marginTop: 12 }}
        onClick={async () => {
          try {
            const user = await client.users.create({
              email: email,
              password: password,
              passwordConfirm: passwordConfirm,
            });
            await client.users.requestVerification(user.email);
            alert(`${email}??? ???????????? ??????????????????`);
            navigate(0);
          } catch (e: any) {
            alertError(e as ClientResponseError);
          }
        }}
      >
        <span>Sign Up</span>
      </LoginButton>
    </LoginCont>
  );
}
