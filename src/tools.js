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
