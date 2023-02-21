import { UpCircleFilled } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { isExpressionWithTypeArguments } from "typescript";
import BaseButton from "../component/BaseButton";
import DNSAddModal from "../component/DNSAddModal";
import DNSUpdateModal from "../component/DNSUpdateModal";
import Horizontal from "../component/Horizontal";
import Input from "../component/Input";
import Select from "../component/Select";
import { Column, Row } from "../component/Table";
import { PrimaryDomain } from "../constant";
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

const Button = styled(BaseButton)`
  height: 30px;
  background-color: #3d62a4;
  color: white;
`;

const SearchWrap = styled(Horizontal)`
  gap: 12px;
`;

const Cont = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 850%;
  max-width: 1100px;
  gap: 2px;
`;

export default function DNSPage() {
  const [searchString, setSearchString] = useState<string>("");
  const client = useAuthStore((store) => store.client);
  const requestRef = useRef(false);

  const [dns, setDNS] = useState<DNS[]>([]);
  const [primary_domain, setPrimary_domain] = useState("dgist.cloud");

  const [loading, setLoading] = useState(false);

  const [addModalVisibility, setAddModalVisibility] = useState(false);
  const [EditModalVisibility, setEditModalVisibility] = useState(false);

  const [idx, setIdx] = useState<number | null>(null);

  const refreshDNS = useCallback(
    (sub: string | undefined) => {
      if (requestRef.current === true) {
        return;
      }
      requestRef.current = true;
      (async () => {
        let filter = `(primary_domain='${primary_domain}')`;
        if (sub) {
          filter = `(primary_domain='${primary_domain}' && sub_domain~'%${sub}%')`;
        }
        setLoading(true);
        const res = await client.records.getFullList(
          "dns",
          200 /* batch size */,
          {
            filter,
            sort: "-created",
          }
        );
        requestRef.current = false;
        setDNS([...res] as any[]);
        setLoading(false);
      })();
    },
    [client, setDNS, primary_domain]
  );

  useEffect(() => {
    if (searchString === "") {
      refreshDNS(undefined);
    } else {
      refreshDNS(searchString);
    }
  }, [refreshDNS, searchString]);

  const deleteDNS = useCallback(
    (idx: number) => {
      const c = window.confirm("Do you really want to delete dns item?");
      if (c === false) {
        return;
      }
      const id = dns[idx].id;
      const sub = dns[idx].sub_domain;
      if (requestRef.current === true) {
        return;
      }
      requestRef.current = true;
      (async () => {
        await client.records.delete("dns", id);
        requestRef.current = false;
        refreshDNS(sub);
      })();
    },
    [client, dns, refreshDNS]
  );

  const openEditModal = useCallback(
    (idx: number) => {
      setIdx(idx);
      setEditModalVisibility(true);
    },
    [dns]
  );

  const closeEditModal = useCallback(() => {
    setIdx(null);
    setEditModalVisibility(false);
  }, [setIdx, setEditModalVisibility]);

  return (
    <Wrap>
      <DNSAddModal
        visibility={addModalVisibility}
        closeAddModal={() => setAddModalVisibility(false)}
        refreshDNS={() => {
          refreshDNS(searchString);
        }}
        sub_domain={searchString}
        primary_domain={primary_domain}
      />
      <DNSUpdateModal
        visibility={EditModalVisibility}
        closeEditModal={closeEditModal}
        refreshDevices={() => {
          refreshDNS(searchString);
        }}
        {...(idx !== null && dns[idx])}
      />
      <SearchWrap>
        <Input
          style={{ width: 120 }}
          placeholder="example"
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
        ></Input>
        <Select></Select>
      </SearchWrap>
      <Cont>
        <Column>
          <div style={{ width: 140 }}>Domain</div>
          <div style={{ width: 200 }}>Email</div>
          <div style={{ width: 100 }}>IP</div>
          <div style={{ flex: 1 }}>description</div>
        </Column>
        {loading ? (
          <></>
        ) : (
          <>
            {dns.length > 0 ? (
              dns.map((props: DNS, idx: number) => (
                <DNSItem
                  key={props.id}
                  my={props.user === client.authStore.model?.id}
                  onEditClick={() => {
                    openEditModal(idx);
                  }}
                  onDeleteClick={() => deleteDNS(idx)}
                  {...props}
                />
              ))
            ) : (
              <Button
                style={{
                  width: "fit-content",
                  paddingLeft: 14,
                  paddingRight: 14,
                }}
                onClick={() => {
                  setAddModalVisibility(true);
                }}
              >
                Add {searchString}.{primary_domain}
              </Button>
            )}
          </>
        )}
      </Cont>
    </Wrap>
  );
}

export type DNS = {
  id: string;
  sub_domain: string;
  primary_domain: string;
  email: string;
  ip: string;
  description: string;
  user: string;
};

type DNSItemProps = {
  onEditClick: () => void;
  onDeleteClick: () => void;
  my: boolean;
} & DNS;

function DNSItem({
  id,
  sub_domain,
  primary_domain,
  email,
  ip,
  description,
  my,
  onEditClick,
  onDeleteClick,
}: DNSItemProps) {
  return (
    <Row>
      <div style={{ width: 140 }}>
        {sub_domain}.{primary_domain}
      </div>
      <div style={{ width: 200 }}>{email}</div>
      <div style={{ width: 100 }}>{ip}</div>
      <div style={{ flex: 1 }}>{description}</div>
      {my && (
        <div style={{ display: "flex", gap: 6 }}>
          <Button style={{}} onClick={onEditClick}>
            <span>Edit</span>
          </Button>
          <Button
            onClick={onDeleteClick}
            style={{ backgroundColor: "#df5056" }}
          >
            <span>Remove</span>
          </Button>
        </div>
      )}
    </Row>
  );
}
