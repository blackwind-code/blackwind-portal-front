import styled from "styled-components";

const Outer = styled.div`
  width: 220px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-left: 10px;
  font-size: 13px;
  &:hover {
    border-color: #3d62a4;
    border-width: 2px;
    padding-left: 9px;
  }
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default function Select() {
//   const [open, setOpen] = useState(false);
  return <Outer>dgist.cloud</Outer>;
}
