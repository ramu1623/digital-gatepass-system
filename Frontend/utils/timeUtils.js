// Convert 24-hour time (HH:mm) to 12-hour format (h:mm AM/PM)
export const to12Hour = (time24) => {
  if (!time24) return "";

  const [h, m] = time24.split(":").map(Number);

  let hour = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";

  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};
