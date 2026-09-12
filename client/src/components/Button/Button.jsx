import styles from "./Button.module.css";

/**
 * Shared button. `variant`: "primary" | "secondary" | "ghost".
 * `size`: "lg" | "md" | "sm". Always renders visible text — icons are
 * decorative only, never the sole label (accessibility requirement).
 */
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = [styles.btn, styles[variant], styles[size], className].join(" ").trim();

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
