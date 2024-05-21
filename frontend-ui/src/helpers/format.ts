import numeral from "numeral";

export const formatHash = (txHash: string, chars = 6) => {
  return `${txHash.substring(0, chars + 2)}...${txHash.substring(txHash.length - chars)}`;
};

export const numberFormat = (num: number | string, format: string = "0,0") => {
  return numeral(num).format(format);
};

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
