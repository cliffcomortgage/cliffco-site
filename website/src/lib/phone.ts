/**
 * tel: href for a display phone like "516-408-7300" or "516-408-7300 x 358".
 * An extension is dialed after a pause (the comma), which phones support.
 */
export const telHref = (phone: string): string => {
  const [main, ext] = phone.split(/\s*(?:x|ext\.?)\s*/i);
  const extDigits = ext ? ext.replace(/\D/g, "") : "";
  return `tel:+1${main.replace(/\D/g, "")}${extDigits ? `,${extDigits}` : ""}`;
};
