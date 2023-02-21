import styled from "styled-components";

const Column = styled.div`
  width: calc(100% - 24px);
  display: flex;
  justify-content: space-around;
  gap: 20px;
  background-color: #ccc;
  border-bottom: 1px solid #eee;
  padding-left: 12px;
  padding-right: 12px;
  font-weight: bold;
  border-radius: 5px;
  & div {
    padding-top: 8px;
    padding-bottom: 8px;
  }
`;

const Row = styled.div`
  width: calc(100% - 24px);
  display: flex;
  justify-content: space-around;
  gap: 20px;
  border-bottom: 1px solid #eee;
  padding-left: 12px;
  padding-right: 12px;
  & div {
    padding-top: 8px;
    padding-bottom: 8px;
  }
`;

export { Column, Row };
