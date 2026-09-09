export const getTenant = (url: string) => {
  const [sub] = new URL(url).hostname.split(".");
  return sub === "otb" ? undefined : sub;
};
