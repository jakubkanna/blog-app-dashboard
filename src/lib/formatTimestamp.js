const formatTimestampFull = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} ${formattedTime}`;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return `${formattedDate}`;
};

export default formatTimestamp;
