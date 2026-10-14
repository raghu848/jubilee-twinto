"use client";

import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { emptyLoginState } from "@/lib/login-form";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, emptyLoginState);

  const field =
    "w-full border-b border-hairline bg-transparent px-0 py-3 text-[16px] outline-none transition-colors focus:border-red-primary";

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label htmlFor="email" className="text-[13px] text-stone">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className={field}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-[13px] text-stone">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-[14px] text-red-primary">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2.5 bg-red-primary px-7 py-3.5 text-[15px] text-white transition-colors hover:bg-red-deep disabled:cursor-progress disabled:bg-red-primary/70"
      >
        {isPending && (
          <span
            className="spin block h-3.5 w-3.5 rounded-full border-[1.5px] border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {isPending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
