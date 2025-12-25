"use client";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, X } from "lucide-react";
import { ProfileFormData, UpdateProfileDialogProps } from "@/types/profileTypes";

export function UpdateProfileDialog({
  username,
  displayName,
  avatar,
  banner,
  bio,
  isPrivate,
  darkMode,
  allowDMs,
  isPending,
  onSave,
}: UpdateProfileDialogProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    username,
    displayName: displayName || "",
    avatar: avatar ?? { fileId: "", url: "" },
    banner: banner ?? { fileId: "", url: "" },
    bio: bio || "",
    isPrivate,
    darkMode,
    allowDMs,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatar?.url || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(banner?.url || null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null, type: "avatar" | "banner") => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === "avatar") {
        setAvatarPreview(result);
        setFormData((prev) => ({
          ...prev,
          avatar: { file: file, fileId: "", url: "" },
        }));
      } else {
        setBannerPreview(result);
        setFormData((prev) => ({
          ...prev,
          banner: { file: file, fileId: "", url: "" },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type: "avatar" | "banner") => {
    if (type === "avatar") {
      setAvatarPreview(null);
      setFormData((prev) => ({ ...prev, avatar: { fileId: "", url: "" } }));
    } else {
      setBannerPreview(null);
      setFormData((prev) => ({ ...prev, banner: { fileId: "", url: "" } }));
    }
  };
  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update Profile</Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleChange("displayName", e.target.value)}
                    placeholder="Enter display name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback>{formData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage("avatar")}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "avatar")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Banner</Label>
                <div className="mt-2">
                  {bannerPreview && (
                    <div className="relative mb-4">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage("banner")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {bannerPreview ? "Change Banner" : "Upload Banner"}
                  </Button>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "banner")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Enter bio"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => handleChange("isPrivate", checked)}
                />
                <Label htmlFor="isPrivate">Private Profile</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="darkMode"
                  checked={formData.darkMode}
                  onCheckedChange={(checked) => handleChange("darkMode", checked)}
                />
                <Label htmlFor="darkMode">Dark Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowDMs"
                  checked={formData.allowDMs}
                  onCheckedChange={(checked) => handleChange("allowDMs", checked)}
                />
                <Label htmlFor="allowDMs">Allow Direct Messages</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button disabled={isPending} onClick={handleSave}>
              {isPending && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
