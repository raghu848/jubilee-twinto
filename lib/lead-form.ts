export type LeadFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
};

// Kept out of the "use server" module: a server-action file may only export
// async functions, so a plain object exported from there arrives as undefined.
export const emptyLeadFormState: LeadFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
