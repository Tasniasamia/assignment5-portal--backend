import z from "zod";


const CreateAdminSchema=z.object({
  password: z
  .string("Password is required")
  .min(8, "Minimum lenth will be 8 characters")
  .max(20, "Maximum length can be 20 characters"),
  admin:z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    profilePhoto: z.url("Invalid URL format").optional(),
    contactNumber: z.string().min(1, "Contact number is required"),
  })
});



export const userValidationSchema = { CreateAdminSchema };
