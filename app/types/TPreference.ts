export type TPreferenceName =
  | "functional"
  | "locationAllowed"
  | "realtimeLocation"
  | "gMaps"
  | "analyticsAllowed"
  | "thirdPartyEmbeds";

export type TPreference = {
  id: TPreferenceName;
  label: string;
  required: boolean;
  description: string;
  detail?: string;
  thirdParty?: boolean | undefined;
  dependsOn?: TPreferenceName | undefined;
};
