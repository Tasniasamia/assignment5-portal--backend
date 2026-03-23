export interface TChangePasswordPayload{
    newPassword:string;
    currentPassword:string;
}


// user.interface.ts

export type IUpdateProfilePayload = {
  name?: string;
  image?: string;
  profilePhoto?: string;
  contactNumber?: string;
};

export type IUpdateAdminPayload = Pick<
  IUpdateProfilePayload,
  "name" | "profilePhoto" | "contactNumber"
>

export type IUpdateMember = Pick<
  IUpdateProfilePayload,
  "name" | "profilePhoto" | "contactNumber"
>

export type IUpdateUserPayload = Pick<IUpdateProfilePayload, "name" | "image">;