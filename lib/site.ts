export const GITHUB_URL = "https://github.com/tushgaurav/shotlist";
export const LOGIN_URL = "/sign-in";
export const SPEC_URL = "https://github.com/tushgaurav/shotlist/blob/main/docs/spec.md";
export const AUTHOR_URL = "https://github.com/tushgaurav";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
