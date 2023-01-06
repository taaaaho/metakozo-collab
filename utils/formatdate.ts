export const format_date = (datetime: string) => {
  const tmp = new Date(datetime).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'JST',
  })
  return tmp
}
