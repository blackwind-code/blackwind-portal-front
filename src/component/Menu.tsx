import styled from "styled-components";
import {
  ClusterOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const Cont = styled.div`
  width: 120px;
  height: calc(100vh - 60px);
  background-color: #eee;
`;

type Menu = {
  icon: React.ReactNode;
  path: string;
  name: string;
};

const menuList = [
  {
    icon: <DashboardOutlined />,
    path: "/main",
    name: "main",
  },
  {
    icon: <ClusterOutlined />,
    path: "/vpn",
    name: "vpn",
  },
  {
    icon: <UserOutlined />,
    path: "/user",
    name: "profile",
  },
];

export default function Menu() {
  const location = useLocation();
  if (location.pathname === "/") {
    return <></>;
  }

  return (
    <Cont>
      {menuList.map((props) => (
        <MenuItem key={props.path} {...props}></MenuItem>
      ))}
    </Cont>
  );
}
const MenuItemCont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  font-size: 32px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
`;

function MenuItem({ icon, path, name }: Menu) {
  const navigate = useNavigate();
  return (
    <MenuItemCont onClick={() => navigate(path)}>
      {icon}
      <span style={{ fontSize: 24 }}>{name}</span>
    </MenuItemCont>
  );
}
