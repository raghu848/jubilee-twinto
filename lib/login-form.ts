export type LoginState = { error: string | null };

// Separate module: a "use server" file may only export async functions.
export const emptyLoginState: LoginState = { error: null };
