import styles from "./DecorativeBackdrop.module.css";

/**
 * Purely decorative background artwork (public/camel-background.png), fixed
 * to the viewport behind the interface, used on every screen. It never
 * carries information and is never required to understand or use the app —
 * `aria-hidden` + `pointer-events: none` keep it fully inert. The same image
 * is cropped to its camel-left / desert-right edges (see the CSS module)
 * with one shared size scale across all screens, and scales down at
 * narrower desktop widths so it never sits under or near interactive
 * content, only hiding entirely on small screens.
 *
 * The hidden SVG filter below remaps the artwork's alpha channel — the
 * source PNG's fill areas are quite low-alpha (sampled as low as ~13-40%
 * opacity), which reads as a washed-out look. This boosts that at render
 * time only (the file itself is untouched) so the linework shows up more
 * clearly while staying soft.
 */
export default function DecorativeBackdrop() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="camel-alpha-boost">
          <feComponentTransfer>
            <feFuncA type="linear" slope="2.2" intercept="0" />
          </feComponentTransfer>
        </filter>
      </svg>
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.left} />
        <div className={styles.right} />
      </div>
    </>
  );
}
