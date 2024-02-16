export const getTenant = (url: string) => {
  const urlObj = new URL(url);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let [tld, domain, sub] = urlObj.hostname.split(".").reverse();
  return sub;
};
