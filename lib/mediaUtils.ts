import { MediaCommand } from "@/types/mediaTypes";

export const isEmptyObject = (value: unknown): boolean => {
  return typeof value === "object" && value !== null && Object.keys(value).length === 0;
};

export const resolveMediaCommand = (
  form: { file?: File; fileId?: string; url?: string } | unknown,
  existing?: { fileId: string; url: string } | unknown,
): MediaCommand => {
  if (isEmptyObject(form)) {
    return { action: "keep" };
  }

  if (isEmptyObject(existing)) {
    existing = undefined;
  }

  const typedForm = form as {
    file?: File;
    fileId?: string;
    url?: string;
  };

  if (typedForm.file) {
    throw new Error("File upload must be handled separately");
  }

  if (!typedForm.fileId && !typedForm.url) {
    return existing ? { action: "delete" } : { action: "keep" };
  }

  if (
    existing &&
    typedForm.fileId === (existing as { fileId: string; url: string }).fileId &&
    typedForm.url === (existing as { fileId: string; url: string }).url
  ) {
    return { action: "keep" };
  }

  return {
    action: "upsert",
    fileId: typedForm.fileId!,
    url: typedForm.url!,
  };
};
