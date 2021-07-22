import colorString from "color-string";

export type Color = string | { toString: () => string };

export function parseColor(
  color: Color,
  alpha: number = 1,
  overrideAlpha: boolean = false
) {
  const stringValue = color.toString();
  const parsed = colorString.get(stringValue);
  if (parsed === null) return "#00000000";
  if (parsed.value[3] === 0 || overrideAlpha) {
    parsed.value[3] = alpha;
  }
  return colorString.to.hex(parsed.value);
}
