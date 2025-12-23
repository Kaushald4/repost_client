export type TMedia = {
  fileId: string;
  url: string;
};

export type WithoutFile<T extends { file?: File }> = Omit<T, "file">;
