import { ClientResponseError } from "pocketbase";

export function alertError(err: ClientResponseError) {
  if (Object.keys(err.data.data).length === 0) {
    alert(err.data.message);
  }
  Object.entries(err.data.data).map(([key, obj]: [string, any]) =>
    alert(`${key}: ${obj.message}`)
  );
}
