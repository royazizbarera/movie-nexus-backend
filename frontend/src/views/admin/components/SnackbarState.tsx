



export interface SnackbarState {
  title: string;
  key?: string;
  open: boolean;
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
  variant?: "solid" | "outlined" | "plain" | "soft";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "neutral" | "danger" | "success" | "warning";
  autoHideDuration?: number; // in ms
}