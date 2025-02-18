function parseIso(dateString: string): string {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return formattedDate;
}

export default parseIso;
