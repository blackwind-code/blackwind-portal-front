import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import BaseButton from "../component/BaseButton";

import DeviceAddModal from "../component/DeviceAddModal";
import DeviceUpdateModal from "../component/DeviceUpdateModal";
import { Column, Row } from "../component/Table";
import { useAuthStore } from "../store/authStore";
import { NoSelect } from "../style";
const Wrap = styled.div`
  width: 100%;
  padding-top: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  ${NoSelect}
`;
const Cont = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 70%;
  max-width: 1100px;
  gap: 2px;
`;

const Button = styled(BaseButton)`
  width: 70px;
  height: 28px;
  background-color: #3d62a4;
  color: #fff;
`;

export default function VPNPage() {
  const client = useAuthStore((store) => store.client);
  const requestRef = useRef(false);

  const [devices, setDevices] = useState<VPNDevice[]>([]);

  const [addModalVisibility, setAddModalVisibility] = useState(false);
  const [EditModalVisibility, setEditModalVisibility] = useState(false);

  const [idx, setIdx] = useState<number | null>(null);

  const openEditModal = useCallback(
    (idx: number) => {
      setIdx(idx);
      setEditModalVisibility(true);
    },
    []
  );
  const closeEditModal = useCallback(() => {
    setIdx(null);
    setEditModalVisibility(false);
  }, [setIdx, setEditModalVisibility]);

  const refreshDevices = useCallback(() => {
    if (requestRef.current === true) {
      return;
    }
    requestRef.current = true;
    (async () => {
      const res = await client.records.getFullList(
        "vpn",
        200 /* batch size */,
        {
          sort: "-created",
        }
      );
      requestRef.current = false;
      setDevices([...res] as any[]);
    })();
  }, [client, setDevices]);

  const deleteDevice = useCallback(
    (idx: number) => {
      const c = window.confirm("Do you really want to delete this vpn item?");
      if (c === false) {
        return;
      }
      const id = devices[idx].id;
      if (requestRef.current === true) {
        return;
      }
      requestRef.current = true;
      (async () => {
        await client.records.delete("vpn", id);
        requestRef.current = false;
        refreshDevices();
      })();
    },
    [client, devices, refreshDevices]
  );

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);
  return (
    <Wrap>
      <DeviceAddModal
        visibility={addModalVisibility}
        closeAddModal={() => setAddModalVisibility(false)}
        refreshDevices={refreshDevices}
      />
      <DeviceUpdateModal
        visibility={EditModalVisibility}
        closeEditModal={closeEditModal}
        refreshDevices={refreshDevices}
        id={idx !== null ? devices[idx].id : undefined}
        zerotier_address={
          idx !== null ? devices[idx].zerotier_address : undefined
        }
        device_type={idx !== null ? devices[idx].device_type : undefined}
        description={idx !== null ? devices[idx].description : undefined}
      />

      <Cont>
        <Button
          style={{
            marginTop: 20,
            marginBottom: 10,
            width: 140,
            alignSelf: "flex-end",
          }}
          onClick={() => setAddModalVisibility(true)}
        >
          Add Device
        </Button>
        <Column>
          <div style={{ width: 140 }}>zerotier address</div>
          <div style={{ width: 100 }}>device type</div>
          <div style={{ flex: 1 }}>description</div>
        </Column>
        {devices.map((props: VPNDevice, idx: number) => (
          <VPNDeviceItem
            onEditClick={() => {
              openEditModal(idx);
            }}
            onDeleteClick={() => deleteDevice(idx)}
            key={props["id"]}
            id={props["id"]}
            zerotier_address={props.zerotier_address}
            device_type={props.device_type}
            description={props.description}
          />
        ))}
      </Cont>
    </Wrap>
  );
}

export type VPNDevice = {
  id: string;
  zerotier_address: string;
  device_type: "client" | "server";
  description: string;
};

type VPNDeviceProps = {
  onEditClick: () => void;
  onDeleteClick: () => void;
} & VPNDevice;

function VPNDeviceItem({
  id,
  zerotier_address,
  device_type,
  description,
  onEditClick,
  onDeleteClick,
}: VPNDeviceProps) {
  return (
    <Row>
      <div style={{ width: 140 }}>{zerotier_address}</div>
      <div style={{ width: 100 }}>{device_type}</div>
      <div style={{ flex: 1 }}>{description}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <Button style={{}} onClick={onEditClick}>
          <span>Edit</span>
        </Button>
        <Button onClick={onDeleteClick} style={{ backgroundColor: "#df5056" }}>
          <span>Remove</span>
        </Button>
      </div>
    </Row>
  );
}
