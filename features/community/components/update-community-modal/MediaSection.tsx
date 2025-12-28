"use client";

import { useCallback } from "react";
import Image from "next/image";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import { MediaSectionProps, MEDIA_ACTIONS } from "./types";

export function MediaSection({
  type,
  mediaState,
  setMediaState,
  existingUrl,
  hasExistingMedia,
}: MediaSectionProps) {
  const { action, file } = mediaState;

  // Determine what to show:
  // - If action is DELETE, show nothing (removed)
  // - If there's a new file uploaded, show the file preview
  // - If there's existing media and action is KEEP, show existing media
  // - If no existing media, show upload area
  const shouldShowPreview = action !== MEDIA_ACTIONS.DELETE && (file || existingUrl);
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;
  const isRemoved = action === MEDIA_ACTIONS.DELETE;

  const handleFileChange = useCallback(
    (newFile: File | null) => {
      if (newFile) {
        setMediaState({ action: MEDIA_ACTIONS.UPDATE, file: newFile });
      }
    },
    [setMediaState],
  );

  const handleRemove = useCallback(() => {
    setMediaState({ action: MEDIA_ACTIONS.DELETE, file: null });
  }, [setMediaState]);

  return (
    <div className="space-y-3">
      <FormLabel className="capitalize">{type}</FormLabel>

      {/* Preview with remove button */}
      {shouldShowPreview && (
        <div
          className={`relative ${
            type === "banner" ? "h-32" : "w-20 h-20"
          } rounded-lg overflow-hidden bg-muted border group`}
        >
          <Image
            fill
            src={previewUrl ?? ""}
            alt={`${type} preview`}
            className={`w-full h-full object-cover ${type === "banner" ? "" : "rounded-full"}`}
          />
          {/* Remove button overlay */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-background/90 hover:bg-background rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            title={`Remove ${type}`}
          >
            <X className="h-4 w-4 text-destructive" />
          </button>
        </div>
      )}

      {/* Upload area - always show when no preview or after removal */}
      {!shouldShowPreview && (
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`${type}-upload`}
            className="flex items-center gap-2 cursor-pointer px-4 py-2 border-2 border-dashed border-border hover:border-primary rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isRemoved ? `Upload new ${type}` : `Upload ${type}`}
            </span>
          </Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileChange(selectedFile);
            }}
          />
        </div>
      )}

      {/* Show filename when file is uploaded but not removed */}
      {file && action === MEDIA_ACTIONS.UPDATE && (
        <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
      )}

      {/* Show message when media was removed */}
      {isRemoved && hasExistingMedia && (
        <p className="text-xs text-destructive">{type} will be removed on save</p>
      )}
    </div>
  );
}
