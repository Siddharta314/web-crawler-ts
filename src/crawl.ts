export function normalizeURL(url: string) {
  const myURL = new URL(url);

  const hostPath = `${myURL.hostname}${myURL.pathname}`;
  return hostPath.endsWith("/") ? hostPath.slice(0, -1) : hostPath;
}
