type TContextRequest = {
  protocol: string;
  host: string;
};

export type TLoaderContext = {
  tenant: string | undefined;
  request: TContextRequest;
};
