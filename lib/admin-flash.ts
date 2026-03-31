export type AdminFlash = {
  type: "success" | "error" | "info";
  title?: string;
  message: string;
};
