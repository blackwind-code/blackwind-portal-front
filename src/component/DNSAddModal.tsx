import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import styled from "styled-components";
import { PrimaryDomain } from "../constant";
import { DNS } from "../route/DNSPage";
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

type DNSAddModalProps = {
  visibility: boolean;
  closeAddModal: () => void;
  refreshDNS: () => void;
} & Partial<DNS>;

export default function DNSAddModal({
  visibility,
  closeAddModal,
  sub_domain,
  primary_domain,
  refreshDNS,
}: DNSAddModalProps) {
  const [ip, setIp] = useState<string | undefined>(undefined);
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
            <Title>sub domain :</Title>
            <Input value={sub_domain} disabled />
            <Title>primary domain :</Title>
            <Input value={primary_domain} disabled />
            <Title>IP :</Title>
            <Input
              type="ip"
              value={ip}
              placeholder="IP address"
              onChange={(e) => {
                setIp(e.target.value);
              }}
            />
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
                  if (
                    ip === undefined ||
                    !!!ip.match(
                      /(25[0-5]|2[0-4]\d|1\d\d|[0-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[0-9]?\d)){3}/g
                    )
                  ) {
                    alert("ip: Invalid value format.");
                    return;
                  }
                  try {
                    await client.records.create("dns", {
                      user: getIdByToken(client.authStore.token),
                      sub_domain,
                      primary_domain,
                      ip,
                      email: client.authStore.model?.email,
                      description,
                    });
                    refreshDNS();
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
