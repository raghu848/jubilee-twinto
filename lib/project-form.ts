export type ProjectFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Record<string, string>;
};

// Separate module: a "use server" file may only export async functions.
export const emptyProjectFormState: ProjectFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
