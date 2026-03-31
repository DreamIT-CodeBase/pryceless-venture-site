import { signOut } from "@/auth";

type SignOutButtonProps = {
  variant?: "sidebar" | "menu";
};

export function SignOutButton({ variant = "sidebar" }: SignOutButtonProps) {
  const className =
    variant === "menu"
      ? "inline-flex w-full items-center justify-center rounded-[14px] border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      : "inline-flex w-full items-center justify-center rounded-full border border-white/24 bg-white/10 px-5 py-3 text-[15px] font-medium text-white transition hover:border-white/38 hover:bg-white/16";

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        className={className}
        type="submit"
      >
        Sign Out
      </button>
    </form>
  );
}
