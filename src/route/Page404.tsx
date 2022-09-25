import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import kirbyPNG from "../asset/food-coma-food.gif";
import { NoSelect } from "../style";

const Cont = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  font-size: 24px;
  font-weight: 600;
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

export default function Page404() {
  return (
    <Cont>
      <img src={kirbyPNG}></img>
      <span style={{marginTop: 20}}>커비가 페이지를 먹어</span> <span>페이지를 찾을 수 없습니다.</span>
      <Back href="/main">메인로 돌아가기</Back>
    </Cont>
  );
}
