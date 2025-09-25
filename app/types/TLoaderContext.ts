type TContextRequest = {
  protocol: string;
  host: string;
};

export type TLoaderContext = {
  tenant: string | undefined;
  request: TContextRequest;
};

export interface LoaderProps {
  context: TLoaderContext;
  params: { tour: string; stop?: string };
  request: {
    protocol: string;
  };
}
