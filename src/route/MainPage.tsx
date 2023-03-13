import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import kirbyPNG from "../asset/food-coma-food.gif";
import BaseButton from "../component/BaseButton";
import { NoSelect } from "../style";

const Cont = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
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
const Button = styled(BaseButton)`
  width: 240px;
  background-color: #3d62a4;
  color: white;
`;

export default function MainPage() {
  return (
    <Cont>
      {/**TODO: welcome paragraph */}
      <Button
        onClick={() => {
          window.location.href = "https://service.blackwind.tech";
        }}
      >
        서비스 소개
      </Button>
      <Button
        style={{ backgroundColor: "#243d68" }}
        onClick={() => {
          window.location.href = "https://cloud.blackwind.tech";
        }}
      >
        {" "}
        클라우드 접속
      </Button>
    </Cont>
  );
}
