export function parseIntoNumber(str: string) {
  const num = Number(str);
  return str.trim() === "" || isNaN(num) || str === "-" || str === "*" ? null : num;
}

export function parseIntoArray(str: string) {
  if (!str || str.match(/^[-*()]+$/)) return null;
  const numbers = str.split('-').map(Number);
  return numbers.some(isNaN) ? null : numbers;
}

