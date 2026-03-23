import z from "zod";

const changePasswordSchema=z.object({
    newPassword: z
    .string("newPassword is required")
    .min(8, "Minimum lenth will be 8 characters")
    .max(20, "Maximum length can be 20 characters"),
    currentPassword: z
    .string("currentPassword is required")
    .min(8, "Minimum lenth will be 8 characters")
    .max(20, "Maximum length can be 20 characters"),

})

export const authValidationSchema = {changePasswordSchema };
