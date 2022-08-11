// courtesy of Arad at https://stackoverflow.com/a/70226943
export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
