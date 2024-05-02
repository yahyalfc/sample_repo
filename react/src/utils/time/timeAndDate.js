
export const time_service = {
  returnTime,
  returnDate,
  convertDateFormat
};

function returnDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

function returnTime() {
  const today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

function convertDateFormat(updatedAt) {
  const today = new Date(updatedAt);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  const date = dd + '/' + mm + '/' + yyyy;
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const time = hours + ':' + minutes + ' ' + ampm;
  return { date, time }
} 