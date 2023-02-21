import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import styled from "styled-components";
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

type DeviceUpdateModalProps = {
  visibility: boolean;
  closeEditModal: () => void;
  refreshDevices: () => void;
} & Partial<VPNDevice>;

export default function DeviceUpdateModal({
  id,
  zerotier_address,
  device_type,
  description,
  visibility,
  closeEditModal,
  refreshDevices,
}: DeviceUpdateModalProps) {
  const [newType, setNewType] = useState<"client" | "server" | undefined>(
    device_type
  );
  const [newDescription, setNewDescription] = useState(description ?? "");
  const client = useAuthStore((store) => store.client);

  useEffect(() => {
    setNewType(device_type);
    setNewDescription(description ?? "");
  }, [device_type, description]);

  return (
    <>
      {visibility && (
        <Background>
          <ModalCont
            onMouseUp={(e) => {
              e.stopPropagation();
            }}
          >
            <Title>zerotier address :</Title>
            <div>{zerotier_address}</div>
            <Title>device type :</Title>
            <ButtonWrap>
              <Button
                style={{
                  marginTop: 12,
                  backgroundColor: newType === "server" ? "#a4c57e" : "#ccc",
                  color: newType === "server" ? "#FFF" : "#EEE",
                }}
                onClick={() => setNewType("server")}
              >
                <span>server</span>
              </Button>
              <Button
                style={{
                  marginTop: 12,
                  backgroundColor: newType === "client" ? "#a4c57e" : "#ccc",
                  color: newType === "server" ? "#FFF" : "#EEE",
                }}
                onClick={() => setNewType("client")}
              >
                <span>client</span>
              </Button>
            </ButtonWrap>
            <Title>description :</Title>
            <Input
              type="description"
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
                  try {
                    await client.records.update("vpn", id, {
                      zerotier_address: zerotier_address,
                      device_type: newType,
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
