import { TUserResponseWrapper } from "./register";

export type UpdateProfileFormProps = {
  user: TUserResponseWrapper["data"];
};

export type MediaCommand =
  | { action: "keep" }
  | { action: "delete" }
  | { action: "upsert"; fileId: string; url: string };
