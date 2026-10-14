export type PostFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Record<string, string>;
};

// Separate module: a "use server" file may only export async functions.
export const emptyPostFormState: PostFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
