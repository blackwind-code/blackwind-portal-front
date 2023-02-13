import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import styled from "styled-components";
import { VPNDevice } from "../route/VPNPage";
import { useAuthStore } from "../store/authStore";
import { alertError } from "../util/error";
import { getIdByToken } from "../util/token";
import BaseButton from "./BaseButton";
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

const Button = styled(BaseButton)`
  background-color: #3d62a4;
  color: #fff;
`;

type DeviceAddModalProps = {
  visibility: boolean;
  closeAddModal: () => void;
  refreshDevices: () => void;
} & Partial<VPNDevice>;

export default function DeviceAddModal({
  visibility,
  closeAddModal,
  refreshDevices,
}: DeviceAddModalProps) {
  const [zerotier_address, setZerotier_address] = useState<string | undefined>(undefined);
  const [device_type, setDevice_type] = useState<"client" | "server" >(
    "client"
  );
  const [description, setDescription] = useState("");
  const client = useAuthStore((store) => store.client);

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
            <Input
              type="zerotier address"
              value={zerotier_address}
              placeholder="zerotier address"
              onChange={(e) => {
                setZerotier_address(e.target.value);
              }}
            />
            <Title>device type :</Title>
            <ButtonWrap>
              <Button
                style={{
                  marginTop: 12,
                  backgroundColor:
                    device_type === "server" ? "#a4c57e" : "#ccc",
                  color: device_type === "server" ? "#FFF" : "#EEE",
                }}
                onClick={() => setDevice_type("server")}
              >
                <span>server</span>
              </Button>
              <Button
                style={{
                  marginTop: 12,
                  backgroundColor:
                    device_type === "client" ? "#a4c57e" : "#ccc",
                  color: device_type === "server" ? "#FFF" : "#EEE",
                }}
                onClick={() => setDevice_type("client")}
              >
                <span>client</span>
              </Button>
            </ButtonWrap>
            <Title>description :</Title>
            <Input
              type="description"
              value={description}
              placeholder="description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <ButtonWrap>
              <Button
                style={{ marginTop: 12, backgroundColor: "#df5056" }}
                onClick={() => closeAddModal()}
              >
                <span>Cancel</span>
              </Button>
              <Button
                style={{ marginTop: 12 }}
                onClick={async () => {
                  try {
                    await client.records.create("vpn", {
                        user: getIdByToken(client.authStore.token),
                      zerotier_address,
                      device_type,
                      description,
                    });
                    refreshDevices();
                    closeAddModal();
                  } catch (e: any) {
                    alertError(e as ClientResponseError);
                  }
                }}
              >
                <span>Add</span>
              </Button>
            </ButtonWrap>
          </ModalCont>
        </Background>
      )}
    </>
  );
}
