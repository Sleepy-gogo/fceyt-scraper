
export function parseIntoNumber(str: string) {
  return str == "-" || str == "" || isNaN(Number(str)) || str == "*" ? null : Number.parseInt(str);
}

export function parseIntoArray(str: string) {
  return str == "-" || str == "" || str == "--" || str == "(**)" ? null : str.split('-').map(Number);
}

