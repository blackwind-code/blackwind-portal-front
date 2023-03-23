export function parseSubDomain(url: string, primary: string) {
  const reg = new RegExp(`([a-z0-9-]+).${primary}$`);
  const res = reg.exec(url);
  if (!!!res) {
    throw new Error("invalid value.");
}
  return res[0];
}

export function isVPN() {
  if (window.location.origin === "http://localhost:3000") {
    return true;
  }
  const sub = parseSubDomain(window.location.origin, "blackwind.tech");
  return sub === "portal";
}