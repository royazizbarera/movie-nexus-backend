/**
 *
 * @param x
 * @param y
 * @param order
 * @example
 * getYearsFromXtoY(2000, 2005, "asc");
 * @returns number[] // [2000, 2001, 2002, 2003, 2004, 2005]
 *
 */

export default function getYearsFromXtoY(
  x: number,
  y: number,
  order: "asc" | "desc" = "asc",
  type: "number" | "string" = "number"
): (number | string)[] {
  const startYear = Math.min(x, y); // Tahun awal
  const endYear = Math.max(x, y); // Tahun akhir

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  // Tentukan urutan berdasarkan parameter `order`
  const sortedYears = order === "desc" ? years.reverse() : years;

  // Tentukan tipe berdasarkan parameter `type`
  return type === "string"
    ? sortedYears.map((year) => year.toString())
    : sortedYears;
}
