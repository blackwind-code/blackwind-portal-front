import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { DNS } from "../route/DNSPage";
import { VPNDevice } from "../route/VPNPage";
import { useAuthStore } from "../store/authStore";
import { alertError } from "../util/error";
import Input from "./Input";

const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #000000a0;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCont = styled.div`
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
  gap: 10px;
`;
const Title = styled.div`
  color: #000;
`;

const ButtonWrap = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.span`
  height: 28px;
  width: 70px;
  background-color: #3d62a4;
  color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

type DNSUpdateModalProps = {
  visibility: boolean;
  closeEditModal: () => void;
  refreshDevices: () => void;
} & Partial<DNS>;

export default function DNSUpdateModal({
  id,
  sub_domain,
  primary_domain,
  description,
  ip,
  visibility,
  closeEditModal,
  refreshDevices,
}: DNSUpdateModalProps) {
  const [newDescription, setNewDescription] = useState(description ?? "");
  const [newIp, setNewIp] = useState(ip ?? "");
  const client = useAuthStore((store) => store.client);

  useEffect(() => {
    setNewIp(ip ?? "");
    setNewDescription(description ?? "");
  }, [ip, description]);

  return (
    <>
      {visibility && (
        <Background>
          <ModalCont
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
          >
            <Title>Sub Domain :</Title>
            <Input value={sub_domain} disabled />
            <Title>Primary Domain :</Title>
            <Input value={primary_domain} disabled />
            <Title>IP Address :</Title>
            <Input
              value={newIp}
              placeholder="description"
              onChange={(e) => {
                setNewIp(e.target.value);
              }}
            />
            <Title>description :</Title>
            <Input
              value={newDescription}
              placeholder="description"
              onChange={(e) => {
                setNewDescription(e.target.value);
              }}
            />
            <ButtonWrap>
              <Button
                style={{ marginTop: 12, backgroundColor: "#df5056" }}
                onClick={() => closeEditModal()}
              >
                <span>Cancel</span>
              </Button>
              <Button
                style={{ marginTop: 12 }}
                onClick={async () => {
                  if (id === undefined) {
                    return;
                  }
                  if (
                    !!!newIp.match(
                      /(25[0-5]|2[0-4]\d|1\d\d|[0-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[0-9]?\d)){3}/g
                    )
                  ) {
                    alert("ip: Invalid value format.");
                    return;
                  }
                  try {
                    await client.records.update("dns", id, {
                      sub_domain,
                      primary_domain,
                      email: client.authStore.model?.email,
                      ip: newIp,
                      description: newDescription,
                    });
                    refreshDevices();
                    closeEditModal();
                  } catch (e: any) {
                    alertError(e as ClientResponseError);
                  }
                }}
              >
                <span>update</span>
              </Button>
            </ButtonWrap>
          </ModalCont>
        </Background>
      )}
    </>
  );
}
