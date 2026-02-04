import { addHours, format } from "date-fns";

export const toJakartaTime = (date?: Date | string) => {
  const inputDate = date ? new Date(date) : new Date();
  const jakartaTime = addHours(inputDate, 7); // UTC +7
  return format(jakartaTime, "yyyy-MM-dd HH:mm:ss");
};


export function toUTC7(date: Date | null | undefined): Date | null {
  if (!date) return null;
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
}

export function convertDatesToUTC7<T extends Record<string, any>>(
  obj: T, 
  dateFields: (keyof T)[]
): T {
  const result = { ...obj };
  dateFields.forEach(field => {
    const value = result[field] as unknown;
    if (value instanceof Date) {
      result[field] = toUTC7(value) as any;
    }
  });
  return result;
}