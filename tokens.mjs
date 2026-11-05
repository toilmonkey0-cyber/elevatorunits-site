/**
 * Field Ledger tokens for Remotion, HyperFrames, and a later extension pass.
 * Source of truth: site/design/tokens-B.json. The CSS variables are site/design/tokens-B.css.
 *
 *   import tokens from "./tokens.mjs";
 */
import tokens from "./design/tokens-B.json" with { type: "json" };

export { tokens };
export default tokens;
export const color = tokens.color;
export const font = tokens.font;
export const fontWeight = tokens.fontWeight;
export const duration = tokens.duration;
export const easing = tokens.easing;
