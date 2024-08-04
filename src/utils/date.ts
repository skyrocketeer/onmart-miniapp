export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function displayTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
}

export function displayHalfAnHourTimeRange(date: Date) {
  const endTime = new Date(date);
  endTime.setMinutes(endTime.getMinutes() + 30);
  return `${displayTime(date)} - ${displayTime(endTime)}`;
}

export function displayDate(date: Date, hint?: boolean) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  if (hint && isToday(date)) {
    return `Hôm nay - ${day}/${month}/${year}`;
  }
  return `${day}/${month}/${year}`;
}

function padToTwoDigits(num) {
  return num.toString().padStart(2, '0');
}

export function fromMilisToDate(milis:number) {
  const date = new Date(milis);
    const day = padToTwoDigits(date.getDate());
  const month = padToTwoDigits(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();
  
  const hour = padToTwoDigits(date.getHours());
  const minute = padToTwoDigits(date.getMinutes());
  const second = padToTwoDigits(date.getSeconds());
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date);

  // Return manually formatted date with locale-based weekday and month names
  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}