import { Base64 } from "js-base64";

type Payload = {
  exp: number;
  id: string;
  type: string;
};

export function getIdByToken(token: string) {
  const payload = JSON.parse(Base64.decode(token.split(".")[1])) as Payload;
  return payload.id;
}
