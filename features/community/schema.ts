import z from "zod";

export const communityFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(21, "Name must be at most 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Name can only contain letters, numbers, and underscores"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  visibility: z.enum(["PUBLIC", "RESTRICTED", "PRIVATE"]),
  icon: z
    .object({
      fileId: z.string().optional(),
      url: z.string().optional(),
      previewUrl: z.string().optional(),
    })
    .optional(),
  banner: z
    .object({
      fileId: z.string().optional(),
      url: z.string().optional(),
      previewUrl: z.string().optional(),
    })
    .optional(),
});

export type CommunityFormValues = z.infer<typeof communityFormSchema>;

export const updateCommunitySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  visibility: z.enum(["PUBLIC", "RESTRICTED", "PRIVATE"]),
  icon: z
    .object({
      action: z.enum(["keep", "update", "delete"]),
      fileId: z.string().optional(),
      url: z.string().optional(),
      previewUrl: z.string().optional(),
    })
    .optional(),
  banner: z
    .object({
      action: z.enum(["keep", "update", "delete"]),
      fileId: z.string().optional(),
      url: z.string().optional(),
      previewUrl: z.string().optional(),
    })
    .optional(),
});

export type UpdateCommunityFormValues = z.infer<typeof updateCommunitySchema>;
