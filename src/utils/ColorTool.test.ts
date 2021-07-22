import { parseColor } from "./ColorTool";

describe("parseColor()", () => {
  test("parse long Hex values", () => {
    expect(parseColor("#123123")).toBe("#123123");
  });
  test("parse short Hex values", () => {
    expect(parseColor("#123")).toBe("#112233");
  });
});
