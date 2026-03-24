export type ICreateCategoryPayload = {
  name: string;
  description?: string;
};

export type IUpdateCategoryPayload = {
  name?: string;
  description?: string;
};