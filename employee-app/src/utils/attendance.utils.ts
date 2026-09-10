export const getDateKey = (date: string) => {
  return date.substring(0, 10);
};

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getCurrentMonth = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const calculateTotalHours = (
  checkIn: string | null,
  checkOut: string | null,
) => {
  if (!checkIn || !checkOut) {
    return "--:--";
  }

  const [inHour, inMin] = checkIn.split(":").map(Number);
  const [outHour, outMin] = checkOut.split(":").map(Number);

  let totalMinutes = outHour * 60 + outMin - (inHour * 60 + inMin);

  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Present":
      return "bg-[#7cb342]";

    case "Late":
      return "bg-[#ffdad6]";

    default:
      return "bg-[#edeeef]";
  }
};

export const getStatusTextColor = (status: string) => {
  switch (status) {
    case "Present":
      return "text-[#5c9d10]";

    case "Late":
      return "text-[#c7a909]";

    default:
      return "text-[#625e58]";
  }
};

export const getStatusTitleColor = (status: string) => {
  switch (status) {
    case "Present":
      return "text-[#5c9d10]";

    case "Late":
      return "text-[#c7a909]";

    default:
      return "text-[#625e58]";
  }
};

export const getCheckInTimeColor = (status: string) => {
  return status === "Late" ? "text-[#ba1a1a]" : "text-[#191c1d]";
};

export const getWeekRange = (date: Date) => {
  const currentDay = date.getDay();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(date);
  monday.setDate(date.getDate() - daysFromMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startKey: formatDateKey(monday),
    endKey: formatDateKey(sunday),
  };
};

export const getMonthRange = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  const firstDay = new Date(year, monthNumber - 1, 1);
  const lastDay = new Date(year, monthNumber, 0);

  return {
    startKey: formatDateKey(firstDay),
    endKey: formatDateKey(lastDay),
  };
};
