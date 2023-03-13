import styled from "styled-components";

const Cont = styled.div`
  background-color: #ddd;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  color: gray;

  font-size: 9pt;
`;

export default function Footer() {
  return <Cont>development by sangmin park(raspberry-pi@dgist.ac.kr)</Cont>;
}
