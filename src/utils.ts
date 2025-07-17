/**
 * 格式化路径
 * @param pathname
 * @returns
 */
export function normalize(
  pathname: string,
  method: "left" | "right" | "both" = "both"
) {
  let trimReg: RegExp = /^\/*|\/*$/g;
  if (method === "left") {
    trimReg = /^\/*/g;
  } else if (method === "right") {
    trimReg = /\/*$/g;
  }
  return pathname.replace(trimReg, "");
}
