// Illustrative holiday exclusion for residential deliveries; provide dates explicitly.
export function isDropOffDay(dateISO, publicHolidays = []) {
  const day = new Date(dateISO + "T12:00:00Z");
  if (Number.isNaN(day.getTime())) throw Error("Invalid ISO date");
  return ![0, 6].includes(day.getUTCDay()) && !publicHolidays.includes(dateISO);
}
