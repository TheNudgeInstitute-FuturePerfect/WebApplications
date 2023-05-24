export const date = (
  value,
  format = "datetime",
  separator = "-",
  monthFormat = "mmm"
) => {
  let _value;
  if (typeof value === "string") _value = new Date(value);
  else _value = value;
  if (_value) {
    const date = _value.getDate();
    const month = _value.getMonth();
    const year = _value.getFullYear().toString().slice(-2);
    const hours =
      _value.getHours() > 12 ? _value.getHours() - 12 : _value.getHours();
    const minutes = _value.getMinutes();
    const ampm = _value.getHours() > 12 ? "PM" : "AM";
    if ((hours === 0 && minutes === 0) || format === "date")
      return `${date}${separator}${
        monthFormat === "mmm"
          ? months(month)
          : month.toString().padStart(2, "0")
      }${separator}${year}`;
    else
      return `${date}${separator}${
        monthFormat === "mmm"
          ? months(month)
          : month.toString().padStart(2, "0")
      }${separator}${year} ${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${ampm}`;
  } else {
    return "";
  }
};

const months = (number) => {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][number];
};

export const duration = (startTime, endTime) => {
  let start_time, end_time;
  if (startTime instanceof String && endTime instanceof String) {
    if (new Date(startTime) !== "Invalid Date")
      start_time = new Date(startTime);
    if (new Date(endTime) !== "Invalid Date") end_time = new Date(endTime);
  } else if (startTime instanceof Date && endTime instanceof Date) {
    start_time = startTime;
    end_time = endTime;
  }
  const difference = end_time - start_time;
  const miliseconds = difference % 1000;
  const total_seconds = (difference - miliseconds) / 1000;
  const seconds = total_seconds % 60;
  const total_minutes = (total_seconds - seconds) / 60;
  const minutes = total_minutes % 60;
  const total_hours = (total_minutes - minutes) / 60;
  let result = [];
  if (total_hours) result.push(`${total_hours}h`);
  if (minutes) result.push(`${minutes}m`);
  if (seconds) result.push(`${seconds}s`);
  if (miliseconds) result.push(`${miliseconds}ms`);
  return result.join(" ");
};
