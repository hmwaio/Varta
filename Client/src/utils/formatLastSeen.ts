export const formatLastSeen = (dateString?: string | null) => {
  if (!dateString) return "Offline";

  const date = new Date(dateString);

  // Invalid date protection
  if (Number.isNaN(date.getTime())) {
    return "Offline";
  }

  const now = new Date();

  // Future date protection
  if (date > now) {
    return "Offline";
  }

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Last seen today at ${time}`;
  }

  if (isYesterday) {
    return `Last seen yesterday at ${time}`;
  }

  const formattedDate = date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return `Last seen at ${formattedDate}`;
};
